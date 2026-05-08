using BE_QuanLyDuLichVaDatTour.DTOs.Cancellation;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class YeuCauHuyTourService : IYeuCauHuyTourService
{
    private readonly IYeuCauHuyTourRepository _repo;
    private readonly IBookingRepository _bookingRepo;

    public YeuCauHuyTourService(IYeuCauHuyTourRepository repo, IBookingRepository bookingRepo)
    {
        _repo = repo;
        _bookingRepo = bookingRepo;
    }

    public async Task<CancellationResponseDto> CreateAsync(long userId, CreateCancellationRequestDto request)
    {
        var booking = await _bookingRepo.GetByIdAsync(request.BookingId)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        if (booking.KhachHangId != userId)
            throw new UnauthorizedAccessException("Bạn không sở hữu booking này.");

        if (booking.TrangThaiBooking == TrangThaiBooking.da_huy)
            throw new InvalidOperationException("Booking này đã bị hủy.");

        var existing = await _repo.GetByBookingIdAsync(request.BookingId);
        if (existing != null && existing.TrangThai == "cho_duyet")
            throw new InvalidOperationException("Đã có yêu cầu hủy đang chờ duyệt cho booking này.");

        var entity = new YeuCauHuyTour
        {
            BookingId = request.BookingId,
            UserId = userId,
            LyDo = request.LyDo.Trim(),
            TrangThai = "cho_duyet",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(entity);
        await _repo.SaveChangesAsync();

        return MapToDto(entity, booking);
    }

    public async Task<CancellationResponseDto?> GetByBookingIdAsync(long userId, long bookingId)
    {
        var entity = await _repo.GetByBookingIdAsync(bookingId);
        if (entity == null || entity.UserId != userId)
            return null;

        return MapToDto(entity, entity.Booking);
    }

    public async Task<List<CancellationResponseDto>> GetMyCancellationRequestsAsync(long userId)
    {
        var items = await _repo.GetByUserIdAsync(userId);
        return items.Select(x => MapToDto(x, x.Booking)).ToList();
    }

    public async Task<List<AdminCancellationResponseDto>> GetPendingAsync()
    {
        var items = await _repo.GetPendingAsync();
        return items.Select(MapToAdminDto).ToList();
    }

    public async Task<AdminCancellationResponseDto> GetByIdAsync(long id)
    {
        var entity = await _repo.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Yêu cầu hủy không tồn tại.");

        return MapToAdminDto(entity);
    }

    public async Task UpdateStatusAsync(long adminUserId, long id, UpdateCancellationRequestDto request)
    {
        var entity = await _repo.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Yêu cầu hủy không tồn tại.");

        if (entity.TrangThai != "cho_duyet")
            throw new InvalidOperationException("Yêu cầu hủy này đã được xử lý.");

        entity.TrangThai = request.TrangThai;
        entity.GhiChuAdmin = request.GhiChuAdmin?.Trim();
        entity.NguoiXuLyId = adminUserId;
        entity.UpdatedAt = DateTime.UtcNow;

        if (request.TrangThai == "da_duyet")
        {
            var booking = await _bookingRepo.GetTrackedByIdAsync(entity.BookingId);
            if (booking != null)
            {
                booking.TrangThaiBooking = TrangThaiBooking.da_huy;
                booking.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _repo.SaveChangesAsync();
    }

    private static CancellationResponseDto MapToDto(YeuCauHuyTour entity, Booking? booking)
    {
        return new CancellationResponseDto
        {
            Id = entity.Id,
            BookingId = entity.BookingId,
            MaBooking = booking?.MaBooking ?? string.Empty,
            TenTour = booking?.LichKhoiHanh?.Tour?.TenTour ?? string.Empty,
            LyDo = entity.LyDo,
            TrangThai = entity.TrangThai,
            GhiChuAdmin = entity.GhiChuAdmin,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    private static AdminCancellationResponseDto MapToAdminDto(YeuCauHuyTour entity)
    {
        return new AdminCancellationResponseDto
        {
            Id = entity.Id,
            BookingId = entity.BookingId,
            MaBooking = entity.Booking?.MaBooking ?? string.Empty,
            TenTour = entity.Booking?.LichKhoiHanh?.Tour?.TenTour ?? string.Empty,
            HoTenKhachHang = entity.User?.HoTen ?? string.Empty,
            EmailKhachHang = entity.User?.Email ?? string.Empty,
            LyDo = entity.LyDo,
            TrangThai = entity.TrangThai,
            GhiChuAdmin = entity.GhiChuAdmin,
            HoTenNguoiXuLy = entity.NguoiXuLy?.HoTen,
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }
}