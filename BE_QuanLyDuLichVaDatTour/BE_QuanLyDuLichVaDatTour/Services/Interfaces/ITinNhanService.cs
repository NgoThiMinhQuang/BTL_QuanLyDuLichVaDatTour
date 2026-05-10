using BE_QuanLyDuLichVaDatTour.DTOs.Chat;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface ITinNhanService
{
    Task<List<TinNhanDto>> GetTinNhanTheoBookingAsync(long bookingId, long currentUserId);
    Task<TinNhanDto> GuiTinNhanAsync(long nguoiGuiId, GuiTinNhanRequestDto request);
    Task MarkAsReadAsync(long bookingId, long userId);
}
