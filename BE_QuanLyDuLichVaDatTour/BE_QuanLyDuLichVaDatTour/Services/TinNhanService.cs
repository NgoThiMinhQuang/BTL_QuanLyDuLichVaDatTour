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
        var booking = await _bookingRepository.GetByIdAsync(bookingId)
            ?? throw new KeyNotFoundException("Booking không tồn tại");
        var currentUser = await _nguoiDungRepository.GetByIdAsync(currentUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại");
        if (booking.KhachHangId != currentUserId && currentUser.VaiTro != VaiTroNguoiDung.admin)
            throw new UnauthorizedAccessException("Bạn không có quyền xem tin nhắn này");

        var tinNhans = await _tinNhanRepository.GetByBookingIdAsync(bookingId);
        await _tinNhanRepository.MarkAsReadAsync(bookingId, currentUserId);

        return tinNhans.Select(t => MapToDto(t)).ToList();
    }

    public async Task<TinNhanDto> GuiTinNhanAsync(long nguoiGuiId, GuiTinNhanRequestDto request)
    {
        if (request.BookingId is null) throw new KeyNotFoundException("BookingId không được để trống");
        var booking = await _bookingRepository.GetByIdAsync(request.BookingId.Value)
            ?? throw new KeyNotFoundException("Booking không tồn tại");
        var nguoiGui = await _nguoiDungRepository.GetByIdAsync(nguoiGuiId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại");
        if (booking.KhachHangId != nguoiGuiId && nguoiGui.VaiTro != VaiTroNguoiDung.admin)
            throw new UnauthorizedAccessException("Bạn không có quyền gửi tin nhắn");

        var tinNhan = CreateTinNhanEntity(request.BookingId, booking.KhachHangId, nguoiGuiId, request.NoiDung);
        await _tinNhanRepository.AddAsync(tinNhan);
        await _tinNhanRepository.SaveChangesAsync();

        return MapToDto(tinNhan, nguoiGui);
    }

    public async Task<List<TinNhanDto>> GetGeneralMessagesAsync(long currentUserId)
    {
        var currentUser = await _nguoiDungRepository.GetByIdAsync(currentUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại");
        var isAdmin = currentUser.VaiTro == VaiTroNguoiDung.admin;
        var tinNhans = await _tinNhanRepository.GetGeneralMessagesAsync(currentUserId, isAdmin);
        return tinNhans.Select(t => MapToDto(t)).ToList();
    }

    public async Task<List<TinNhanDto>> GetGeneralByKhachHangIdAsync(long adminId, long khachHangId)
    {
        var admin = await _nguoiDungRepository.GetByIdAsync(adminId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại");
        if (admin.VaiTro != VaiTroNguoiDung.admin)
            throw new UnauthorizedAccessException("Bạn không có quyền xem tin nhắn hỗ trợ");

        var tinNhans = await _tinNhanRepository.GetGeneralByKhachHangIdAsync(khachHangId);
        return tinNhans.Select(t => MapToDto(t)).ToList();
    }

    public async Task<TinNhanDto> GuiGeneralMessageAsync(long nguoiGuiId, string noiDung)
    {
        var nguoiGui = await _nguoiDungRepository.GetByIdAsync(nguoiGuiId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại");

        var tinNhan = CreateTinNhanEntity(null, nguoiGuiId, nguoiGuiId, noiDung);
        await _tinNhanRepository.AddAsync(tinNhan);
        await _tinNhanRepository.SaveChangesAsync();

        return MapToDto(tinNhan, nguoiGui);
    }

    public async Task<TinNhanDto> AdminReplyGeneralMessageAsync(long adminId, long khachHangId, string noiDung)
    {
        var admin = await _nguoiDungRepository.GetByIdAsync(adminId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại");
        if (admin.VaiTro != VaiTroNguoiDung.admin) throw new UnauthorizedAccessException("Bạn không có quyền trả lời tin nhắn");
        var khachHang = await _nguoiDungRepository.GetByIdAsync(khachHangId)
            ?? throw new KeyNotFoundException("Khách hàng không tồn tại");

        var tinNhan = CreateTinNhanEntity(null, khachHangId, adminId, noiDung);
        await _tinNhanRepository.AddAsync(tinNhan);
        await _tinNhanRepository.SaveChangesAsync();

        return MapToDto(tinNhan, admin);
    }

    public async Task MarkAsReadAsync(long bookingId, long userId)
    {
        await _tinNhanRepository.MarkAsReadAsync(bookingId, userId);
    }

    private static TinNhan CreateTinNhanEntity(long? bookingId, long khachHangId, long nguoiGuiId, string noiDung)
    {
        var now = DateTime.UtcNow;
        return new TinNhan
        {
            BookingId = bookingId,
            KhachHangId = khachHangId,
            NguoiGuiId = nguoiGuiId,
            NoiDung = noiDung.Trim(),
            DaDoc = false,
            ThoiGianGui = now,
            CreatedAt = now,
            UpdatedAt = now
        };
    }

    private static TinNhanDto MapToDto(TinNhan t, NguoiDung? nguoiGui = null)
    {
        var sender = nguoiGui ?? t.NguoiGui;
        return new TinNhanDto
        {
            Id = t.Id,
            BookingId = t.BookingId,
            KhachHangId = t.KhachHangId,
            NguoiGuiId = t.NguoiGuiId,
            HoTenNguoiGui = sender?.HoTen ?? "Ẩn danh",
            VaiTro = sender?.VaiTro.ToString() ?? "",
            NoiDung = t.NoiDung,
            DaDoc = t.DaDoc,
            ThoiGianGui = t.ThoiGianGui
        };
    }
}
