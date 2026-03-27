using BLL.DTOs.Booking;
using BLL.Interfaces;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;
using System.Security.Cryptography;

namespace BLL.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly ILichKhoiHanhRepository _lichKhoiHanhRepository;
    private readonly IBangGiaLichKhoiHanhRepository _bangGiaLichKhoiHanhRepository;
    private readonly INguoiDungRepository _nguoiDungRepository;

    public BookingService(
        IBookingRepository bookingRepository,
        ILichKhoiHanhRepository lichKhoiHanhRepository,
        IBangGiaLichKhoiHanhRepository bangGiaLichKhoiHanhRepository,
        INguoiDungRepository nguoiDungRepository)
    {
        _bookingRepository = bookingRepository;
        _lichKhoiHanhRepository = lichKhoiHanhRepository;
        _bangGiaLichKhoiHanhRepository = bangGiaLichKhoiHanhRepository;
        _nguoiDungRepository = nguoiDungRepository;
    }

    public async Task<BookingResponseDto> CreateAsync(long currentUserId, CreateBookingRequestDto request)
    {
        var nguoiDung = await EnsureNguoiDungExistsAsync(currentUserId);
        var lichKhoiHanh = await EnsureLichKhoiHanhAvailableAsync(request.LichKhoiHanhId);

        ValidatePassengerCounts(request.SoNguoiLon, request.SoTreEm, request.SoEmBe, lichKhoiHanh.SoChoToiDa);

        var hoTenLienHe = NormalizeRequiredValue(request.HoTenLienHe ?? nguoiDung.HoTen, "Họ tên liên hệ không được để trống.");
        var emailLienHe = NormalizeRequiredValue(request.EmailLienHe ?? nguoiDung.Email, "Email liên hệ không được để trống.");
        var soDienThoaiLienHe = NormalizeRequiredValue(request.SoDienThoaiLienHe ?? nguoiDung.SoDienThoai, "Số điện thoại liên hệ không được để trống.");
        var diaChiLienHe = NormalizeOptionalValue(request.DiaChiLienHe ?? nguoiDung.DiaChi);
        var ghiChu = NormalizeOptionalValue(request.GhiChu);
        var loaiGiaApDung = ResolveLoaiGiaApDung(lichKhoiHanh.NgayKhoiHanh);

        var bangGia = await _bangGiaLichKhoiHanhRepository.GetBangGiaAsync(lichKhoiHanh.Id, loaiGiaApDung);
        var donGiaNguoiLon = GetDonGia(bangGia, LoaiKhach.nguoi_lon, "người lớn");
        var donGiaTreEm = GetDonGia(bangGia, LoaiKhach.tre_em, "trẻ em");
        var donGiaEmBe = GetDonGia(bangGia, LoaiKhach.em_be, "em bé");

        var maBooking = await GenerateUniqueMaBookingAsync();
        var tamTinh = request.SoNguoiLon * donGiaNguoiLon
            + request.SoTreEm * donGiaTreEm
            + request.SoEmBe * donGiaEmBe;

        var now = DateTime.UtcNow;
        var booking = new Booking
        {
            MaBooking = maBooking,
            LichKhoiHanhId = lichKhoiHanh.Id,
            NguoiDungId = nguoiDung.Id,
            HoTenLienHe = hoTenLienHe,
            EmailLienHe = emailLienHe,
            SoDienThoaiLienHe = soDienThoaiLienHe,
            DiaChiLienHe = diaChiLienHe,
            NgayDat = now,
            SoNguoiLon = request.SoNguoiLon,
            SoTreEm = request.SoTreEm,
            SoEmBe = request.SoEmBe,
            LoaiGiaApDung = loaiGiaApDung,
            DonGiaNguoiLon = donGiaNguoiLon,
            DonGiaTreEm = donGiaTreEm,
            DonGiaEmBe = donGiaEmBe,
            TamTinh = tamTinh,
            GiamGia = 0m,
            TongTien = tamTinh,
            SoTienDaThanhToan = 0m,
            TienCocYeuCau = 0m,
            PhuongThucThanhToanDuKien = request.PhuongThucThanhToanDuKien,
            TrangThaiBooking = TrangThaiBooking.cho_thanh_toan,
            TrangThaiThanhToan = TrangThaiThanhToan.chua_thanh_toan,
            HanThanhToan = now.AddHours(24),
            GhiChu = ghiChu,
            CreatedAt = now,
            UpdatedAt = now,
            LichKhoiHanh = lichKhoiHanh,
            NguoiDung = nguoiDung
        };

        await _bookingRepository.AddAsync(booking);
        await _bookingRepository.SaveChangesAsync();

        return MapBookingResponse(booking);
    }

    public async Task<List<BookingListItemDto>> GetMyBookingsAsync(long currentUserId)
    {
        await EnsureNguoiDungExistsAsync(currentUserId);

        var bookings = await _bookingRepository.GetByNguoiDungIdAsync(currentUserId);
        return bookings.Select(MapBookingListItem).ToList();
    }

    public async Task<BookingResponseDto> GetMyBookingByIdAsync(long currentUserId, long id)
    {
        var booking = await _bookingRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        if (booking.NguoiDungId != currentUserId)
        {
            throw new KeyNotFoundException("Booking không tồn tại.");
        }

        return MapBookingResponse(booking);
    }

    public async Task<List<BookingAdminResponseDto>> GetAllAsync()
    {
        var bookings = await _bookingRepository.GetAllAsync();
        return bookings.Select(MapBookingAdminResponse).ToList();
    }

    public async Task<BookingAdminResponseDto> GetByIdAsync(long id)
    {
        var booking = await _bookingRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        return MapBookingAdminResponse(booking);
    }

    public async Task UpdateStatusAsync(long adminUserId, long id, UpdateBookingStatusRequestDto request)
    {
        var adminUser = await EnsureNguoiDungExistsAsync(adminUserId);
        var booking = await _bookingRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        booking.TrangThaiBooking = request.TrangThaiBooking;
        if (request.TrangThaiThanhToan.HasValue)
        {
            booking.TrangThaiThanhToan = request.TrangThaiThanhToan.Value;
        }

        var ghiChu = NormalizeOptionalValue(request.GhiChu);
        if (ghiChu is not null)
        {
            booking.GhiChu = ghiChu;
        }

        if (request.TrangThaiBooking == TrangThaiBooking.da_xac_nhan)
        {
            booking.NguoiXacNhanId = adminUser.Id;
            booking.NguoiXacNhan = adminUser;
            booking.ThoiGianXacNhan = DateTime.UtcNow;
        }

        booking.UpdatedAt = DateTime.UtcNow;
        await _bookingRepository.SaveChangesAsync();
    }

    private async Task<NguoiDung> EnsureNguoiDungExistsAsync(long nguoiDungId)
    {
        return await _nguoiDungRepository.GetByIdAsync(nguoiDungId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");
    }

    private async Task<LichKhoiHanh> EnsureLichKhoiHanhAvailableAsync(long lichKhoiHanhId)
    {
        var lichKhoiHanh = await _lichKhoiHanhRepository.GetByIdAsync(lichKhoiHanhId)
            ?? throw new KeyNotFoundException("Lịch khởi hành không tồn tại.");

        if (lichKhoiHanh.TrangThai != TrangThaiLichKhoiHanh.mo_ban)
        {
            throw new InvalidOperationException("Lịch khởi hành hiện không mở bán.");
        }

        if (lichKhoiHanh.Tour is null || lichKhoiHanh.Tour.TrangThai != TrangThaiTour.dang_mo_ban)
        {
            throw new InvalidOperationException("Tour hiện không mở bán.");
        }

        return lichKhoiHanh;
    }

    private static void ValidatePassengerCounts(int soNguoiLon, int soTreEm, int soEmBe, int soChoToiDa)
    {
        if (soNguoiLon < 1)
        {
            throw new InvalidOperationException("Booking phải có ít nhất 1 người lớn.");
        }

        var tongHanhKhach = soNguoiLon + soTreEm + soEmBe;
        if (tongHanhKhach > soChoToiDa)
        {
            throw new InvalidOperationException("Số lượng hành khách vượt quá số chỗ tối đa.");
        }
    }

    private static LoaiGiaApDung ResolveLoaiGiaApDung(DateTime ngayKhoiHanh)
    {
        return ngayKhoiHanh.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday
            ? LoaiGiaApDung.cuoi_tuan
            : LoaiGiaApDung.ngay_thuong;
    }

    private static decimal GetDonGia(Dictionary<LoaiKhach, decimal> bangGia, LoaiKhach loaiKhach, string tenLoaiKhach)
    {
        if (!bangGia.TryGetValue(loaiKhach, out var donGia))
        {
            throw new InvalidOperationException($"Chưa cấu hình bảng giá cho {tenLoaiKhach}.");
        }

        if (donGia < 0)
        {
            throw new InvalidOperationException($"Đơn giá {tenLoaiKhach} không hợp lệ.");
        }

        return donGia;
    }

    private async Task<string> GenerateUniqueMaBookingAsync()
    {
        for (var i = 0; i < 10; i++)
        {
            var maBooking = $"BK-{DateTime.UtcNow:yyyyMMddHHmmss}-{RandomNumberGenerator.GetInt32(1000, 10000)}";
            var existing = await _bookingRepository.GetByMaBookingAsync(maBooking);
            if (existing is null)
            {
                return maBooking;
            }
        }

        throw new InvalidOperationException("Không thể tạo mã booking duy nhất.");
    }

    private static string NormalizeRequiredValue(string? value, string errorMessage)
    {
        var normalizedValue = value?.Trim();
        if (string.IsNullOrWhiteSpace(normalizedValue))
        {
            throw new InvalidOperationException(errorMessage);
        }

        return normalizedValue;
    }

    private static string? NormalizeOptionalValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    private static int GetTongHanhKhach(Booking booking)
    {
        return (int)(booking.SoNguoiLon + booking.SoTreEm + booking.SoEmBe);
    }

    private static BookingListItemDto MapBookingListItem(Booking booking)
    {
        return new BookingListItemDto
        {
            Id = booking.Id,
            MaBooking = booking.MaBooking,
            TenTour = booking.LichKhoiHanh?.Tour?.TenTour ?? string.Empty,
            MaDotTour = booking.LichKhoiHanh?.MaDotTour ?? string.Empty,
            NgayKhoiHanh = booking.LichKhoiHanh?.NgayKhoiHanh ?? default,
            TongHanhKhach = GetTongHanhKhach(booking),
            TongTien = booking.TongTien,
            TrangThaiBooking = booking.TrangThaiBooking.ToString(),
            TrangThaiThanhToan = booking.TrangThaiThanhToan.ToString(),
            NgayDat = booking.NgayDat
        };
    }

    private static BookingResponseDto MapBookingResponse(Booking booking)
    {
        return new BookingResponseDto
        {
            Id = booking.Id,
            MaBooking = booking.MaBooking,
            LichKhoiHanhId = booking.LichKhoiHanhId,
            MaDotTour = booking.LichKhoiHanh?.MaDotTour ?? string.Empty,
            NgayKhoiHanh = booking.LichKhoiHanh?.NgayKhoiHanh ?? default,
            NgayKetThuc = booking.LichKhoiHanh?.NgayKetThuc ?? default,
            TourId = booking.LichKhoiHanh?.TourId ?? 0,
            MaTour = booking.LichKhoiHanh?.Tour?.MaTour ?? string.Empty,
            TenTour = booking.LichKhoiHanh?.Tour?.TenTour ?? string.Empty,
            HoTenLienHe = booking.HoTenLienHe,
            EmailLienHe = booking.EmailLienHe,
            SoDienThoaiLienHe = booking.SoDienThoaiLienHe,
            DiaChiLienHe = booking.DiaChiLienHe,
            NgayDat = booking.NgayDat,
            SoNguoiLon = booking.SoNguoiLon,
            SoTreEm = booking.SoTreEm,
            SoEmBe = booking.SoEmBe,
            TongHanhKhach = GetTongHanhKhach(booking),
            LoaiGiaApDung = booking.LoaiGiaApDung.ToString(),
            DonGiaNguoiLon = booking.DonGiaNguoiLon,
            DonGiaTreEm = booking.DonGiaTreEm,
            DonGiaEmBe = booking.DonGiaEmBe,
            TamTinh = booking.TamTinh,
            GiamGia = booking.GiamGia,
            TongTien = booking.TongTien,
            SoTienDaThanhToan = booking.SoTienDaThanhToan,
            TienCocYeuCau = booking.TienCocYeuCau,
            PhuongThucThanhToanDuKien = booking.PhuongThucThanhToanDuKien?.ToString(),
            TrangThaiBooking = booking.TrangThaiBooking.ToString(),
            TrangThaiThanhToan = booking.TrangThaiThanhToan.ToString(),
            HanThanhToan = booking.HanThanhToan,
            GhiChu = booking.GhiChu,
            CreatedAt = booking.CreatedAt,
            UpdatedAt = booking.UpdatedAt
        };
    }

    private static BookingAdminResponseDto MapBookingAdminResponse(Booking booking)
    {
        var response = new BookingAdminResponseDto
        {
            NguoiDungId = booking.NguoiDungId,
            HoTenNguoiDat = booking.NguoiDung?.HoTen ?? string.Empty,
            EmailNguoiDat = booking.NguoiDung?.Email ?? string.Empty,
            NguoiXacNhanId = booking.NguoiXacNhanId,
            ThoiGianXacNhan = booking.ThoiGianXacNhan
        };

        var detail = MapBookingResponse(booking);
        response.Id = detail.Id;
        response.MaBooking = detail.MaBooking;
        response.LichKhoiHanhId = detail.LichKhoiHanhId;
        response.MaDotTour = detail.MaDotTour;
        response.NgayKhoiHanh = detail.NgayKhoiHanh;
        response.NgayKetThuc = detail.NgayKetThuc;
        response.TourId = detail.TourId;
        response.MaTour = detail.MaTour;
        response.TenTour = detail.TenTour;
        response.HoTenLienHe = detail.HoTenLienHe;
        response.EmailLienHe = detail.EmailLienHe;
        response.SoDienThoaiLienHe = detail.SoDienThoaiLienHe;
        response.DiaChiLienHe = detail.DiaChiLienHe;
        response.NgayDat = detail.NgayDat;
        response.SoNguoiLon = detail.SoNguoiLon;
        response.SoTreEm = detail.SoTreEm;
        response.SoEmBe = detail.SoEmBe;
        response.TongHanhKhach = detail.TongHanhKhach;
        response.LoaiGiaApDung = detail.LoaiGiaApDung;
        response.DonGiaNguoiLon = detail.DonGiaNguoiLon;
        response.DonGiaTreEm = detail.DonGiaTreEm;
        response.DonGiaEmBe = detail.DonGiaEmBe;
        response.TamTinh = detail.TamTinh;
        response.GiamGia = detail.GiamGia;
        response.TongTien = detail.TongTien;
        response.SoTienDaThanhToan = detail.SoTienDaThanhToan;
        response.TienCocYeuCau = detail.TienCocYeuCau;
        response.PhuongThucThanhToanDuKien = detail.PhuongThucThanhToanDuKien;
        response.TrangThaiBooking = detail.TrangThaiBooking;
        response.TrangThaiThanhToan = detail.TrangThaiThanhToan;
        response.HanThanhToan = detail.HanThanhToan;
        response.GhiChu = detail.GhiChu;
        response.CreatedAt = detail.CreatedAt;
        response.UpdatedAt = detail.UpdatedAt;
        return response;
    }
}
