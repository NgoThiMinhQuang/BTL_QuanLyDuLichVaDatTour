using BE_QuanLyDuLichVaDatTour.DTOs.Chat;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface ITinNhanService
{
    Task<List<TinNhanDto>> GetTinNhanTheoBookingAsync(long bookingId, long currentUserId);
    Task<List<TinNhanDto>> GetGeneralMessagesAsync(long currentUserId);
    Task<TinNhanDto> GuiTinNhanAsync(long nguoiGuiId, GuiTinNhanRequestDto request);
    Task<TinNhanDto> GuiGeneralMessageAsync(long nguoiGuiId, string noiDung);
    Task<TinNhanDto> AdminReplyGeneralMessageAsync(long adminId, long khachHangId, string noiDung);
    Task MarkAsReadAsync(long bookingId, long userId);
}
