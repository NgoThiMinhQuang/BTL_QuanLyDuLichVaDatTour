using BE_QuanLyDuLichVaDatTour.DTOs.ThongBao;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IThongBaoService
{
    Task<List<ThongBaoResponseDto>> GetMyNotificationsAsync(long userId, int limit = 20, int offset = 0);
    Task<int> GetUnreadCountAsync(long userId);
    Task MarkAsReadAsync(long userId, long notificationId);
    Task MarkAllAsReadAsync(long userId);
    Task DeleteAsync(long userId, long notificationId);
    Task<int> BroadcastAsync(long adminUserId, BroadcastNotificationRequestDto request);
}