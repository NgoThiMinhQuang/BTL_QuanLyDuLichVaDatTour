using BE_QuanLyDuLichVaDatTour.DTOs.Booking;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using System.Security.Cryptography;
using System.Linq;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly ILichKhoiHanhRepository _lichKhoiHanhRepository;
    private readonly IBangGiaLichKhoiHanhRepository _bangGiaLichKhoiHanhRepository;
    private readonly INguoiDungRepository _nguoiDungRepository;
    private readonly IVoucherRepository _voucherRepository;

    public BookingService(
        IBookingRepository bookingRepository,
        ILichKhoiHanhRepository lichKhoiHanhRepository,
        IBangGiaLichKhoiHanhRepository bangGiaLichKhoiHanhRepository,
        INguoiDungRepository nguoiDungRepository,
        IVoucherRepository voucherRepository)
    {
        _bookingRepository = bookingRepository;
        _lichKhoiHanhRepository = lichKhoiHanhRepository;
        _bangGiaLichKhoiHanhRepository = bangGiaLichKhoiHanhRepository;
        _nguoiDungRepository = nguoiDungRepository;
        _voucherRepository = voucherRepository;
    }

    public async Task<BookingResponseDto> CreateAsync(long currentUserId, CreateBookingRequestDto request)
    {
        var nguoiDung = await EnsureNguoiDungExistsAsync(currentUserId);
        var lichKhoiHanh = await EnsureLichKhoiHanhAvailableAsync(request.LichKhoiHanhId);

        ValidatePassengerCounts(request.SoNguoiLon, request.SoTreEm, request.SoEmBe, lichKhoiHanh.SoChoToiDa);
        await ValidateSeatAvailabilityAsync(lichKhoiHanh, request.SoNguoiLon + request.SoTreEm + request.SoEmBe);
        ValidateHanhKhachList(request.HanhKhachs, request.SoNguoiLon, request.SoTreEm, request.SoEmBe);

        var now = DateTime.UtcNow;
        var hanhKhachs = MapHanhKhachs(request.HanhKhachs, now);

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
        var voucher = await ResolveVoucherAsync(request.VoucherId, request.MaVoucher, lichKhoiHanh.TourId, tamTinh);
        var giamGia = voucher is null ? 0m : CalculateDiscount(voucher, tamTinh);

        var booking = new Booking
        {
            MaBooking = maBooking,
            LichKhoiHanhId = lichKhoiHanh.Id,
            KhachHangId = nguoiDung.Id,
            VoucherId = voucher?.Id,
            HoTenLienHe = hoTenLienHe,
            EmailLienHe = emailLienHe,
            SoDienThoaiLienHe = soDienThoaiLienHe,
            DiaChiLienHe = diaChiLienHe,
            NgayDat = now,
            SoNguoiLon = checked((short)request.SoNguoiLon),
            SoTreEm = checked((short)request.SoTreEm),
            SoEmBe = checked((short)request.SoEmBe),
            LoaiGiaApDung = loaiGiaApDung,
            DonGiaNguoiLon = donGiaNguoiLon,
            DonGiaTreEm = donGiaTreEm,
            DonGiaEmBe = donGiaEmBe,
            TamTinh = tamTinh,
            GiamGia = giamGia,
            TongTien = tamTinh - giamGia,
            SoTienDaThanhToan = 0m,
            TienCocYeuCau = 0m,
            PhuongThucThanhToanDuKien = request.PhuongThucThanhToanDuKien,
            TrangThaiBooking = TrangThaiBooking.cho_thanh_toan,
            TrangThaiThanhToan = TrangThaiThanhToan.chua_thanh_toan,
            HanThanhToan = now.AddHours(24),
            GhiChu = ghiChu,
            CreatedAt = now,
            UpdatedAt = now,
            HanhKhachs = new List<HanhKhach>()
        };

        await _bookingRepository.AddAsync(booking);
        await _bookingRepository.SaveChangesAsync();

        foreach (var hanhKhach in hanhKhachs)
        {
            hanhKhach.BookingId = booking.Id;
            booking.HanhKhachs.Add(hanhKhach);
        }

        if (voucher is not null)
        {
            voucher.SoLuongDaDung += 1;
            voucher.UpdatedAt = now;
        }

        await _bookingRepository.SaveChangesAsync();
        await SyncLichKhoiHanhAvailabilityAsync(lichKhoiHanh, GetTongHanhKhach(booking));
        await _bookingRepository.SaveChangesAsync();

        return MapBookingResponse(booking);
    }

    public async Task<List<BookingListItemDto>> GetMyBookingsAsync(long currentUserId)
    {
        await EnsureNguoiDungExistsAsync(currentUserId);

        var bookings = await _bookingRepository.GetByNguoiDungIdAsync(currentUserId);
        return bookings.Select(MapBookingListItem).ToList();
    }

    public async Task<List<BookingListItemDto>> GetMyBookingsFilteredAsync(long currentUserId, string? status, DateTime? fromDate, DateTime? toDate, string? sortBy, bool? ascending)
    {
        await EnsureNguoiDungExistsAsync(currentUserId);

        var bookings = await _bookingRepository.GetByNguoiDungIdAsync(currentUserId);

        IEnumerable<Booking> query = bookings;

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(b => b.TrangThaiBooking.ToString() == status);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(b => b.NgayDat >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            var toEnd = toDate.Value.Date.AddDays(1).AddTicks(-1);
            query = query.Where(b => b.NgayDat <= toEnd);
        }

        var asc = ascending ?? false;
        query = sortBy switch
        {
            "tongTien" => asc ? query.OrderBy(b => b.TongTien) : query.OrderByDescending(b => b.TongTien),
            "ngayKhoiHanh" => asc
                ? query.OrderBy(b => b.LichKhoiHanh?.NgayKhoiHanh ?? DateTime.MaxValue)
                : query.OrderByDescending(b => b.LichKhoiHanh?.NgayKhoiHanh ?? DateTime.MinValue),
            _ => asc ? query.OrderBy(b => b.NgayDat) : query.OrderByDescending(b => b.NgayDat),
        };

        return query.Select(MapBookingListItem).ToList();
    }

    public async Task<BookingResponseDto> GetMyBookingByIdAsync(long currentUserId, long id)
    {
        var booking = await _bookingRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        if (booking.KhachHangId != currentUserId)
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

    public async Task<List<BookingAdminResponseDto>> GetAllFilteredAsync(string? status, DateTime? fromDate, DateTime? toDate, string? sortBy, bool? ascending)
    {
        var bookings = await _bookingRepository.GetAllAsync();
        IEnumerable<Booking> query = bookings;

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<TrangThaiBooking>(status, true, out var tt))
        {
            query = query.Where(b => b.TrangThaiBooking == tt);
        }

        if (fromDate.HasValue)
        {
            query = query.Where(b => b.NgayDat >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            var toEnd = toDate.Value.Date.AddDays(1).AddTicks(-1);
            query = query.Where(b => b.NgayDat <= toEnd);
        }

        var asc = ascending ?? false;
        query = sortBy switch
        {
            "tongTien" => asc ? query.OrderBy(b => b.TongTien) : query.OrderByDescending(b => b.TongTien),
            "ngayKhoiHanh" => asc
                ? query.OrderBy(b => b.LichKhoiHanh?.NgayKhoiHanh ?? DateTime.MaxValue)
                : query.OrderByDescending(b => b.LichKhoiHanh?.NgayKhoiHanh ?? DateTime.MinValue),
            _ => asc ? query.OrderBy(b => b.NgayDat) : query.OrderByDescending(b => b.NgayDat),
        };

        return query.Select(MapBookingAdminResponse).ToList();
    }

    public async Task<byte[]> ExportExcelAsync(string? status, DateTime? fromDate, DateTime? toDate)
    {
        var bookings = await GetAllFilteredAsync(status, fromDate, toDate, null, null);

        using var package = new ExcelPackage();
        var ws = package.Workbook.Worksheets.Add("Bookings");

        var headers = new[] { "Mã Booking", "Tour", "Mã Đợt", "Ngày KH", "Khách hàng", "Email", "SĐT", "Người lớn", "Trẻ em", "Em bé", "Tạm tính", "Giảm giá", "Tổng tiền", "Đã thanh toán", "Trạng thái booking", "Trạng thái TT", "Ngày đặt" };
        for (var i = 0; i < headers.Length; i++)
        {
            ws.Cells[1, i + 1].Value = headers[i];
            ws.Cells[1, i + 1].Style.Font.Bold = true;
            ws.Cells[1, i + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
            ws.Cells[1, i + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);
        }

        for (var r = 0; r < bookings.Count; r++)
        {
            var b = bookings[r];
            var row = r + 2;
            ws.Cells[row, 1].Value = b.MaBooking;
            ws.Cells[row, 2].Value = b.TenTour;
            ws.Cells[row, 3].Value = b.MaDotTour;
            ws.Cells[row, 4].Value = b.NgayKhoiHanh.ToString("dd/MM/yyyy");
            ws.Cells[row, 5].Value = b.HoTenNguoiDat;
            ws.Cells[row, 6].Value = b.EmailNguoiDat;
            ws.Cells[row, 7].Value = b.SoDienThoaiLienHe;
            ws.Cells[row, 8].Value = b.SoNguoiLon;
            ws.Cells[row, 9].Value = b.SoTreEm;
            ws.Cells[row, 10].Value = b.SoEmBe;
            ws.Cells[row, 11].Value = b.TamTinh;
            ws.Cells[row, 12].Value = b.GiamGia;
            ws.Cells[row, 13].Value = b.TongTien;
            ws.Cells[row, 14].Value = b.SoTienDaThanhToan;
            ws.Cells[row, 15].Value = b.TrangThaiBooking;
            ws.Cells[row, 16].Value = b.TrangThaiThanhToan;
            ws.Cells[row, 17].Value = b.NgayDat.ToString("dd/MM/yyyy HH:mm");
        }

        ws.Cells[ws.Dimension.Address].AutoFitColumns();
        return await package.GetAsByteArrayAsync();
    }

    public async Task<BookingAdminResponseDto> GetByIdAsync(long id)
    {
        var booking = await _bookingRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        return MapBookingAdminResponse(booking);
    }

    public async Task UpdateStatusAsync(long adminUserId, long id, UpdateBookingStatusRequestDto request)
    {
        _ = await EnsureNguoiDungExistsAsync(adminUserId);

        var booking = await _bookingRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        var oldStatus = booking.TrangThaiBooking;
        if (!IsSeatHoldingStatus(oldStatus) && IsSeatHoldingStatus(request.TrangThaiBooking))
        {
            await ValidateSeatAvailabilityAsync(booking.LichKhoiHanh ?? throw new InvalidOperationException("Booking chưa có lịch khởi hành."), GetTongHanhKhach(booking), booking.Id);
        }

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

        booking.UpdatedAt = DateTime.UtcNow;
        if (booking.LichKhoiHanh is not null)
        {
            await SyncLichKhoiHanhAvailabilityAsync(
                booking.LichKhoiHanh,
                IsSeatHoldingStatus(booking.TrangThaiBooking) ? GetTongHanhKhach(booking) : 0,
                booking.Id);
        }

        await _bookingRepository.SaveChangesAsync();
    }

    private async Task<NguoiDung> EnsureNguoiDungExistsAsync(long nguoiDungId)
    {
        return await _nguoiDungRepository.GetByIdAsync(nguoiDungId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");
    }

    private async Task<LichKhoiHanh> EnsureLichKhoiHanhAvailableAsync(long lichKhoiHanhId)
    {
        var lichKhoiHanh = await _lichKhoiHanhRepository.GetTrackedByIdAsync(lichKhoiHanhId)
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

    private async Task ValidateSeatAvailabilityAsync(LichKhoiHanh lichKhoiHanh, int requestedSeats, long? excludeBookingId = null)
    {
        var bookedSeats = await _bookingRepository.GetBookedSeatsAsync(lichKhoiHanh.Id, excludeBookingId);
        var remainingSeats = lichKhoiHanh.SoChoToiDa - bookedSeats;

        if (requestedSeats > remainingSeats)
        {
            throw new InvalidOperationException($"Lịch khởi hành chỉ còn {Math.Max(remainingSeats, 0)} chỗ trống.");
        }
    }

    private async Task SyncLichKhoiHanhAvailabilityAsync(LichKhoiHanh lichKhoiHanh, int additionalBookedSeats = 0, long? excludeBookingId = null)
    {
        var bookedSeats = await _bookingRepository.GetBookedSeatsAsync(lichKhoiHanh.Id, excludeBookingId) + additionalBookedSeats;

        if (bookedSeats >= lichKhoiHanh.SoChoToiDa && lichKhoiHanh.TrangThai == TrangThaiLichKhoiHanh.mo_ban)
        {
            lichKhoiHanh.TrangThai = TrangThaiLichKhoiHanh.het_cho;
            lichKhoiHanh.UpdatedAt = DateTime.UtcNow;
            return;
        }

        if (bookedSeats < lichKhoiHanh.SoChoToiDa && lichKhoiHanh.TrangThai == TrangThaiLichKhoiHanh.het_cho)
        {
            lichKhoiHanh.TrangThai = TrangThaiLichKhoiHanh.mo_ban;
            lichKhoiHanh.UpdatedAt = DateTime.UtcNow;
        }
    }

    private static bool IsSeatHoldingStatus(TrangThaiBooking status)
    {
        return status != TrangThaiBooking.da_huy;
    }

    private static void ValidateHanhKhachList(List<CreateHanhKhachRequestDto>? hanhKhachs, int soNguoiLon, int soTreEm, int soEmBe)
    {
        if (hanhKhachs is null || hanhKhachs.Count == 0)
        {
            return;
        }

        var countNguoiLon = hanhKhachs.Count(x => x.LoaiKhach == LoaiKhach.nguoi_lon);
        var countTreEm = hanhKhachs.Count(x => x.LoaiKhach == LoaiKhach.tre_em);
        var countEmBe = hanhKhachs.Count(x => x.LoaiKhach == LoaiKhach.em_be);

        if (countNguoiLon != soNguoiLon || countTreEm != soTreEm || countEmBe != soEmBe)
        {
            throw new InvalidOperationException("Danh sách hành khách không khớp với số lượng người lớn, trẻ em, em bé.");
        }
    }

    private static List<HanhKhach> MapHanhKhachs(List<CreateHanhKhachRequestDto>? hanhKhachs, DateTime now)
    {
        if (hanhKhachs is null || hanhKhachs.Count == 0)
        {
            return new List<HanhKhach>();
        }

        return hanhKhachs.Select(x =>
        {
            if (x.NgaySinh.HasValue)
            {
                ValidatePassengerAge(x.NgaySinh.Value, x.LoaiKhach);
            }

            return new HanhKhach
            {
                HoTen = NormalizeRequiredValue(x.HoTen, "Họ tên hành khách không được để trống."),
                LoaiKhach = x.LoaiKhach,
                NgaySinh = x.NgaySinh,
                GioiTinh = NormalizeGioiTinh(x.GioiTinh),
                SoGiayTo = NormalizeOptionalValue(x.SoGiayTo),
                QuocTich = NormalizeOptionalValue(x.QuocTich),
                GhiChu = NormalizeOptionalValue(x.GhiChu),
                CreatedAt = now,
                UpdatedAt = now
            };
        }).ToList();
    }

    private static void ValidatePassengerAge(DateTime ngaySinh, LoaiKhach loaiKhach)
    {
        var today = DateTime.UtcNow.Date;
        var age = today.Year - ngaySinh.Year;
        if (ngaySinh.Date > today.AddYears(-age)) age--;

        var expectedType = age >= 12 ? LoaiKhach.nguoi_lon
            : age >= 2 ? LoaiKhach.tre_em
            : LoaiKhach.em_be;

        if (loaiKhach != expectedType)
        {
            var typeName = loaiKhach switch
            {
                LoaiKhach.nguoi_lon => "người lớn",
                LoaiKhach.tre_em => "trẻ em",
                LoaiKhach.em_be => "em bé",
                _ => loaiKhach.ToString()
            };

            var expectedName = expectedType switch
            {
                LoaiKhach.nguoi_lon => "người lớn (từ 12 tuổi)",
                LoaiKhach.tre_em => "trẻ em (2-11 tuổi)",
                LoaiKhach.em_be => "em bé (dưới 2 tuổi)",
                _ => expectedType.ToString()
            };

            throw new InvalidOperationException($"Hành khách {age} tuổi phải được phân loại là {expectedName}, không phải {typeName}.");
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

    private async Task<Voucher?> ResolveVoucherAsync(long? voucherId, string? maVoucher, long tourId, decimal tamTinh)
    {
        if (voucherId.HasValue && !string.IsNullOrWhiteSpace(maVoucher))
        {
            throw new InvalidOperationException("Chỉ được truyền VoucherId hoặc MaVoucher.");
        }

        Voucher? voucher = null;

        if (voucherId.HasValue)
        {
            voucher = await _voucherRepository.GetTrackedByIdAsync(voucherId.Value)
                ?? throw new KeyNotFoundException("Voucher không tồn tại.");
        }
        else if (!string.IsNullOrWhiteSpace(maVoucher))
        {
            voucher = await _voucherRepository.GetByMaVoucherAsync(maVoucher.Trim());
            if (voucher is null)
            {
                throw new KeyNotFoundException("Voucher không tồn tại.");
            }

            voucher = await _voucherRepository.GetTrackedByIdAsync(voucher.Id)
                ?? throw new KeyNotFoundException("Voucher không tồn tại.");
        }

        if (voucher is null)
        {
            return null;
        }

        ValidateVoucherForBooking(voucher, tourId, tamTinh);
        return voucher;
    }

    private static void ValidateVoucherForBooking(Voucher voucher, long tourId, decimal tamTinh)
    {
        var now = DateTime.UtcNow;

        if (voucher.TrangThai != TrangThaiVoucher.hoat_dong)
        {
            throw new InvalidOperationException("Voucher hiện không hoạt động.");
        }

        if (voucher.NgayBatDau > now || voucher.NgayKetThuc < now)
        {
            throw new InvalidOperationException("Voucher hiện không nằm trong thời gian áp dụng.");
        }

        if (voucher.SoLuongDaDung >= voucher.SoLuongToiDa)
        {
            throw new InvalidOperationException("Voucher đã hết lượt sử dụng.");
        }

        if (voucher.TourId.HasValue && voucher.TourId.Value != tourId)
        {
            throw new InvalidOperationException("Voucher không áp dụng cho tour này.");
        }

        if (tamTinh < voucher.DonHangToiThieu)
        {
            throw new InvalidOperationException("Booking chưa đạt giá trị tối thiểu để áp dụng voucher.");
        }
    }

    private static decimal CalculateDiscount(Voucher voucher, decimal tamTinh)
    {
        var giamGia = voucher.KieuGiam == KieuGiamVoucher.phan_tram
            ? tamTinh * voucher.GiaTriGiam / 100m
            : voucher.GiaTriGiam;

        if (voucher.GiamToiDa.HasValue && giamGia > voucher.GiamToiDa.Value)
        {
            giamGia = voucher.GiamToiDa.Value;
        }

        return giamGia > tamTinh ? tamTinh : giamGia;
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

    private static string? NormalizeGioiTinh(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        var normalized = value.Trim().ToLowerInvariant();
        return normalized switch
        {
            "nam" or "male" or "m" => "nam",
            "nữ" or "nu" or "female" or "f" => "nu",
            "khác" or "khac" or "other" or "o" => "khac",
            _ => normalized
        };
    }

    private static int GetTongHanhKhach(Booking booking)
    {
        return booking.SoNguoiLon + booking.SoTreEm + booking.SoEmBe;
    }

    private static BookingListItemDto MapBookingListItem(Booking booking)
    {
        var daDanhGia = booking.DanhGias.Any();
        var coTheDanhGia = booking.TrangThaiBooking == TrangThaiBooking.hoan_tat && !daDanhGia;

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
            NgayDat = booking.NgayDat,
            CoTheDanhGia = coTheDanhGia,
            DaDanhGia = daDanhGia
        };
    }

    private static BookingResponseDto MapBookingResponse(Booking booking)
    {
        var daDanhGia = booking.DanhGias.Any();
        var coTheDanhGia = booking.TrangThaiBooking == TrangThaiBooking.hoan_tat && !daDanhGia;

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
            VoucherId = booking.VoucherId,
            MaVoucher = booking.Voucher?.MaVoucher,
            TenVoucher = booking.Voucher?.TenVoucher,
            TongTien = booking.TongTien,
            SoTienDaThanhToan = booking.SoTienDaThanhToan,
            TienCocYeuCau = booking.TienCocYeuCau,
            PhuongThucThanhToanDuKien = booking.PhuongThucThanhToanDuKien?.ToString(),
            TrangThaiBooking = booking.TrangThaiBooking.ToString(),
            TrangThaiThanhToan = booking.TrangThaiThanhToan.ToString(),
            HanThanhToan = booking.HanThanhToan,
            GhiChu = booking.GhiChu,
            HanhKhachs = booking.HanhKhachs
                .OrderBy(x => x.Id)
                .Select(MapHanhKhachResponse)
                .ToList(),
            CoTheDanhGia = coTheDanhGia,
            DaDanhGia = daDanhGia,
            CreatedAt = booking.CreatedAt,
            UpdatedAt = booking.UpdatedAt
        };
    }

    private static HanhKhachResponseDto MapHanhKhachResponse(HanhKhach hanhKhach)
    {
        return new HanhKhachResponseDto
        {
            Id = hanhKhach.Id,
            HoTen = hanhKhach.HoTen,
            LoaiKhach = hanhKhach.LoaiKhach.ToString(),
            NgaySinh = hanhKhach.NgaySinh,
            GioiTinh = hanhKhach.GioiTinh,
            SoGiayTo = hanhKhach.SoGiayTo,
            QuocTich = hanhKhach.QuocTich,
            GhiChu = hanhKhach.GhiChu
        };
    }

    private static BookingAdminResponseDto MapBookingAdminResponse(Booking booking)
    {
        var response = new BookingAdminResponseDto
        {
            NguoiDungId = booking.KhachHangId,
            HoTenNguoiDat = booking.KhachHang?.HoTen ?? string.Empty,
            EmailNguoiDat = booking.KhachHang?.Email ?? string.Empty
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
        response.HanhKhachs = detail.HanhKhachs;
        response.CreatedAt = detail.CreatedAt;
        response.UpdatedAt = detail.UpdatedAt;
        return response;
    }
}
