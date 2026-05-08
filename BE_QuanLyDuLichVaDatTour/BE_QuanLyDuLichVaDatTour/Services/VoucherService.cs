using BE_QuanLyDuLichVaDatTour.DTOs.Voucher;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class VoucherService : IVoucherService
{
    private readonly IVoucherRepository _voucherRepository;
    private readonly ITourRepository _tourRepository;
    private readonly IBookingRepository _bookingRepository;

    public VoucherService(IVoucherRepository voucherRepository, ITourRepository tourRepository, IBookingRepository bookingRepository)
    {
        _voucherRepository = voucherRepository;
        _tourRepository = tourRepository;
        _bookingRepository = bookingRepository;
    }

    public async Task<List<VoucherAdminResponseDto>> GetAllAsync()
    {
        var vouchers = await _voucherRepository.GetAllAsync();
        return vouchers.Select(MapResponse).ToList();
    }

    public async Task<VoucherAdminResponseDto> GetByIdAsync(long id)
    {
        var voucher = await _voucherRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Voucher không tồn tại.");

        return MapResponse(voucher);
    }

    public async Task<VoucherAdminResponseDto> CreateAsync(CreateVoucherRequestDto request)
    {
        var maVoucher = NormalizeRequiredValue(request.MaVoucher, "Mã voucher không được để trống.");
        var tenVoucher = NormalizeRequiredValue(request.TenVoucher, "Tên voucher không được để trống.");

        ValidateVoucherRules(request.KieuGiam, request.GiaTriGiam, request.GiamToiDa, request.NgayBatDau, request.NgayKetThuc, request.SoLuongToiDa, 0);
        await EnsureMaVoucherIsUniqueAsync(maVoucher);
        var tour = await EnsureTourExistsIfNeededAsync(request.TourId);

        var now = DateTime.UtcNow;
        var voucher = new Voucher
        {
            MaVoucher = maVoucher,
            TenVoucher = tenVoucher,
            TourId = request.TourId,
            KieuGiam = request.KieuGiam,
            GiaTriGiam = request.GiaTriGiam,
            GiamToiDa = request.GiamToiDa,
            DonHangToiThieu = request.DonHangToiThieu,
            NgayBatDau = request.NgayBatDau,
            NgayKetThuc = request.NgayKetThuc,
            SoLuongToiDa = request.SoLuongToiDa,
            SoLuongDaDung = 0,
            MoTa = NormalizeOptionalValue(request.MoTa),
            TrangThai = request.TrangThai ?? TrangThaiVoucher.hoat_dong,
            CreatedAt = now,
            UpdatedAt = now,
            Tour = tour
        };

        await _voucherRepository.AddAsync(voucher);
        await _voucherRepository.SaveChangesAsync();

        return MapResponse(voucher);
    }

    public async Task<VoucherAdminResponseDto> UpdateAsync(long id, UpdateVoucherRequestDto request)
    {
        var voucher = await _voucherRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Voucher không tồn tại.");

        var maVoucher = NormalizeRequiredValue(request.MaVoucher, "Mã voucher không được để trống.");
        var tenVoucher = NormalizeRequiredValue(request.TenVoucher, "Tên voucher không được để trống.");

        ValidateVoucherRules(request.KieuGiam, request.GiaTriGiam, request.GiamToiDa, request.NgayBatDau, request.NgayKetThuc, request.SoLuongToiDa, request.SoLuongDaDung);
        await EnsureMaVoucherIsUniqueAsync(maVoucher, id);
        var tour = await EnsureTourExistsIfNeededAsync(request.TourId);

        voucher.MaVoucher = maVoucher;
        voucher.TenVoucher = tenVoucher;
        voucher.TourId = request.TourId;
        voucher.KieuGiam = request.KieuGiam;
        voucher.GiaTriGiam = request.GiaTriGiam;
        voucher.GiamToiDa = request.GiamToiDa;
        voucher.DonHangToiThieu = request.DonHangToiThieu;
        voucher.NgayBatDau = request.NgayBatDau;
        voucher.NgayKetThuc = request.NgayKetThuc;
        voucher.SoLuongToiDa = request.SoLuongToiDa;
        voucher.SoLuongDaDung = request.SoLuongDaDung;
        voucher.MoTa = NormalizeOptionalValue(request.MoTa);
        voucher.TrangThai = request.TrangThai;
        voucher.UpdatedAt = DateTime.UtcNow;
        voucher.Tour = tour;

        await _voucherRepository.SaveChangesAsync();

        return MapResponse(voucher);
    }

    public async Task UpdateStatusAsync(long id, UpdateVoucherStatusRequestDto request)
    {
        var voucher = await _voucherRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Voucher không tồn tại.");

        voucher.TrangThai = request.TrangThai;
        voucher.UpdatedAt = DateTime.UtcNow;

        await _voucherRepository.SaveChangesAsync();
    }

    private async Task EnsureMaVoucherIsUniqueAsync(string maVoucher, long? currentId = null)
    {
        var existingVoucher = await _voucherRepository.GetByMaVoucherAsync(maVoucher);
        if (existingVoucher is not null && existingVoucher.Id != currentId)
        {
            throw new InvalidOperationException("Mã voucher đã tồn tại.");
        }
    }

    private async Task<Tour?> EnsureTourExistsIfNeededAsync(long? tourId)
    {
        if (!tourId.HasValue)
        {
            return null;
        }

        return await _tourRepository.GetByIdAsync(tourId.Value)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");
    }

    private static void ValidateVoucherRules(KieuGiamVoucher kieuGiam, decimal giaTriGiam, decimal? giamToiDa, DateTime ngayBatDau, DateTime ngayKetThuc, int soLuongToiDa, int soLuongDaDung)
    {
        if (ngayKetThuc < ngayBatDau)
        {
            throw new InvalidOperationException("Ngày kết thúc không được nhỏ hơn ngày bắt đầu.");
        }

        if (soLuongToiDa < 0 || soLuongDaDung < 0 || soLuongDaDung > soLuongToiDa)
        {
            throw new InvalidOperationException("Số lượng voucher không hợp lệ.");
        }

        if (giaTriGiam <= 0)
        {
            throw new InvalidOperationException("Giá trị giảm phải lớn hơn 0.");
        }

        if (kieuGiam == KieuGiamVoucher.phan_tram && giaTriGiam > 100)
        {
            throw new InvalidOperationException("Giảm phần trăm không được vượt quá 100.");
        }

        if (giamToiDa.HasValue && giamToiDa.Value < 0)
        {
            throw new InvalidOperationException("Giảm tối đa không hợp lệ.");
        }
    }

    private static string NormalizeRequiredValue(string value, string errorMessage)
    {
        var normalizedValue = value.Trim();
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

    public async Task<List<VoucherUserResponseDto>> GetAvailableForUserAsync(long userId)
    {
        var vouchers = await _voucherRepository.GetAvailableVouchersAsync();
        var usedIds = await _voucherRepository.GetUsedVoucherIdsByUserAsync(userId);
        var usedSet = new HashSet<long>(usedIds);

        return vouchers
            .Where(x => !usedSet.Contains(x.Id))
            .Select(x => new VoucherUserResponseDto
            {
                Id = x.Id,
                MaVoucher = x.MaVoucher,
                TenVoucher = x.TenVoucher,
                KieuGiam = x.KieuGiam.ToString(),
                GiaTriGiam = x.GiaTriGiam,
                GiamToiDa = x.GiamToiDa,
                DonHangToiThieu = x.DonHangToiThieu,
                NgayBatDau = x.NgayBatDau,
                NgayKetThuc = x.NgayKetThuc,
                MoTa = x.MoTa,
                SoLuongConLai = x.SoLuongToiDa - x.SoLuongDaDung
            })
            .ToList();
    }

    public async Task<List<VoucherHistoryResponseDto>> GetVoucherHistoryAsync(long userId)
    {
        var bookings = await _bookingRepository.GetByNguoiDungIdAsync(userId);
        return bookings
            .Where(x => x.VoucherId != null && x.Voucher != null)
            .Select(x => new VoucherHistoryResponseDto
            {
                Id = x.Voucher!.Id,
                MaVoucher = x.Voucher!.MaVoucher,
                TenVoucher = x.Voucher!.TenVoucher,
                KieuGiam = x.Voucher!.KieuGiam.ToString(),
                GiaTriGiam = x.Voucher!.GiaTriGiam,
                MaBooking = x.MaBooking,
                BookingId = x.Id,
                NgayDat = x.NgayDat,
                TongTien = x.TongTien,
                TrangThaiBooking = x.TrangThaiBooking.ToString()
            })
            .ToList();
    }

    private static VoucherAdminResponseDto MapResponse(Voucher voucher)
    {
        return new VoucherAdminResponseDto
        {
            Id = voucher.Id,
            MaVoucher = voucher.MaVoucher,
            TenVoucher = voucher.TenVoucher,
            TourId = voucher.TourId,
            MaTour = voucher.Tour?.MaTour,
            TenTour = voucher.Tour?.TenTour,
            KieuGiam = voucher.KieuGiam.ToString(),
            GiaTriGiam = voucher.GiaTriGiam,
            GiamToiDa = voucher.GiamToiDa,
            DonHangToiThieu = voucher.DonHangToiThieu,
            NgayBatDau = voucher.NgayBatDau,
            NgayKetThuc = voucher.NgayKetThuc,
            SoLuongToiDa = voucher.SoLuongToiDa,
            SoLuongDaDung = voucher.SoLuongDaDung,
            MoTa = voucher.MoTa,
            TrangThai = voucher.TrangThai.ToString(),
            CreatedAt = voucher.CreatedAt,
            UpdatedAt = voucher.UpdatedAt
        };
    }
}
