using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.Chat;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class TinNhanService : ITinNhanService
{
    private readonly ITinNhanRepository _tinNhanRepository;
    private readonly INguoiDungRepository _nguoiDungRepository;
    private readonly IBookingRepository _bookingRepository;

    public TinNhanService(
        ITinNhanRepository tinNhanRepository,
        INguoiDungRepository nguoiDungRepository,
        IBookingRepository bookingRepository)
    {
        _tinNhanRepository = tinNhanRepository;
        _nguoiDungRepository = nguoiDungRepository;
        _bookingRepository = bookingRepository;
    }

    public async Task<List<TinNhanDto>> GetTinNhanTheoBookingAsync(long bookingId, long currentUserId)
    {
        // Verify booking exists
        var booking = await _bookingRepository.GetByIdAsync(bookingId);
        if (booking is null) throw new KeyNotFoundException("Booking không tồn tại");

        // Check permission: booking owner or admin
        var currentUser = await _nguoiDungRepository.GetByIdAsync(currentUserId);
        if (currentUser is null) throw new KeyNotFoundException("Người dùng không tồn tại");

        if (booking.KhachHangId != currentUserId && currentUser.VaiTro != VaiTroNguoiDung.admin)
            throw new UnauthorizedAccessException("Bạn không có quyền xem tin nhắn này");

        var tinNhans = await _tinNhanRepository.GetByBookingIdAsync(bookingId);

        // Mark messages as read
        await _tinNhanRepository.MarkAsReadAsync(bookingId, currentUserId);

        return tinNhans.Select(t => new TinNhanDto
        {
            Id = t.Id,
            BookingId = t.BookingId,
            NguoiGuiId = t.NguoiGuiId,
            HoTenNguoiGui = t.NguoiGui?.HoTen ?? "Ẩn danh",
            VaiTro = t.NguoiGui?.VaiTro.ToString() ?? "",
            NoiDung = t.NoiDung,
            DaDoc = t.DaDoc,
            ThoiGianGui = t.ThoiGianGui
        }).ToList();
    }

    public async Task<TinNhanDto> GuiTinNhanAsync(long nguoiGuiId, GuiTinNhanRequestDto request)
    {
        if (request.BookingId is null) throw new KeyNotFoundException("BookingId không được để trống");
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId.Value);
        if (booking is null) throw new KeyNotFoundException("Booking không tồn tại");

        // Check permission: booking owner or admin can send
        var nguoiGui = await _nguoiDungRepository.GetByIdAsync(nguoiGuiId);
        if (nguoiGui is null) throw new KeyNotFoundException("Người dùng không tồn tại");

        if (booking.KhachHangId != nguoiGuiId && nguoiGui.VaiTro != VaiTroNguoiDung.admin)
            throw new UnauthorizedAccessException("Bạn không có quyền gửi tin nhắn");

        var tinNhan = new TinNhan
        {
            BookingId = request.BookingId,
            NguoiGuiId = nguoiGuiId,
            NoiDung = request.NoiDung.Trim(),
            DaDoc = false,
            ThoiGianGui = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _tinNhanRepository.AddAsync(tinNhan);
        await _tinNhanRepository.SaveChangesAsync();

        return new TinNhanDto
        {
            Id = tinNhan.Id,
            BookingId = tinNhan.BookingId,
            NguoiGuiId = tinNhan.NguoiGuiId,
            HoTenNguoiGui = nguoiGui.HoTen,
            VaiTro = nguoiGui.VaiTro.ToString(),
            NoiDung = tinNhan.NoiDung,
            DaDoc = tinNhan.DaDoc,
            ThoiGianGui = tinNhan.ThoiGianGui
        };
    }

    public async Task<List<TinNhanDto>> GetGeneralMessagesAsync(long currentUserId)
    {
        var currentUser = await _nguoiDungRepository.GetByIdAsync(currentUserId);
        if (currentUser is null) throw new KeyNotFoundException("Người dùng không tồn tại");

        var isAdmin = currentUser.VaiTro == VaiTroNguoiDung.admin;
        var tinNhans = await _tinNhanRepository.GetGeneralMessagesAsync(currentUserId, isAdmin);

        return tinNhans.Select(t => new TinNhanDto
        {
            Id = t.Id,
            BookingId = t.BookingId,
            NguoiGuiId = t.NguoiGuiId,
            HoTenNguoiGui = t.NguoiGui?.HoTen ?? "Ẩn danh",
            VaiTro = t.NguoiGui?.VaiTro.ToString() ?? "",
            NoiDung = t.NoiDung,
            DaDoc = t.DaDoc,
            ThoiGianGui = t.ThoiGianGui
        }).ToList();
    }

    public async Task<TinNhanDto> GuiGeneralMessageAsync(long nguoiGuiId, string noiDung)
    {
        var nguoiGui = await _nguoiDungRepository.GetByIdAsync(nguoiGuiId);
        if (nguoiGui is null) throw new KeyNotFoundException("Người dùng không tồn tại");

        var tinNhan = new TinNhan
        {
            BookingId = null,
            NguoiGuiId = nguoiGuiId,
            NoiDung = noiDung.Trim(),
            DaDoc = false,
            ThoiGianGui = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _tinNhanRepository.AddAsync(tinNhan);
        await _tinNhanRepository.SaveChangesAsync();

        return new TinNhanDto
        {
            Id = tinNhan.Id,
            BookingId = tinNhan.BookingId,
            NguoiGuiId = tinNhan.NguoiGuiId,
            HoTenNguoiGui = nguoiGui.HoTen,
            VaiTro = nguoiGui.VaiTro.ToString(),
            NoiDung = tinNhan.NoiDung,
            DaDoc = tinNhan.DaDoc,
            ThoiGianGui = tinNhan.ThoiGianGui
        };
    }

    public async Task MarkAsReadAsync(long bookingId, long userId)
    {
        await _tinNhanRepository.MarkAsReadAsync(bookingId, userId);
    }
}
