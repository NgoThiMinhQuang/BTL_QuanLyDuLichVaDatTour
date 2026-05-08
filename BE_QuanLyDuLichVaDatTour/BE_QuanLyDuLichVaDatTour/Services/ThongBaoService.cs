using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.ThongBao;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class ThongBaoService : IThongBaoService
{
    private readonly IThongBaoRepository _repo;
    private readonly AppDbContext _context;

    public ThongBaoService(IThongBaoRepository repo, AppDbContext context)
    {
        _repo = repo;
        _context = context;
    }

    public async Task<List<ThongBaoResponseDto>> GetMyNotificationsAsync(long userId, int limit = 20, int offset = 0)
    {
        var items = await _repo.GetByUserIdAsync(userId, limit, offset);
        return items.Select(MapToDto).ToList();
    }

    public async Task<int> GetUnreadCountAsync(long userId)
    {
        return await _repo.GetUnreadCountAsync(userId);
    }

    public async Task MarkAsReadAsync(long userId, long notificationId)
    {
        var item = await _repo.GetTrackedByIdAsync(notificationId)
            ?? throw new KeyNotFoundException("Thông báo không tồn tại.");
        if (item.UserId != userId)
            throw new UnauthorizedAccessException();
        item.DaDoc = true;
        await _repo.SaveChangesAsync();
    }

    public async Task MarkAllAsReadAsync(long userId)
    {
        var items = await _repo.GetByUserIdAsync(userId, 1000, 0);
        var changed = false;
        foreach (var item in items.Where(x => !x.DaDoc))
        {
            var tracked = await _repo.GetTrackedByIdAsync(item.Id);
            if (tracked != null) { tracked.DaDoc = true; changed = true; }
        }
        if (changed) await _repo.SaveChangesAsync();
    }

    public async Task DeleteAsync(long userId, long notificationId)
    {
        var item = await _repo.GetTrackedByIdAsync(notificationId)
            ?? throw new KeyNotFoundException("Thông báo không tồn tại.");
        if (item.UserId != userId)
            throw new UnauthorizedAccessException();
        _context.ThongBaos.Remove(item);
        await _repo.SaveChangesAsync();
    }

    private static ThongBaoResponseDto MapToDto(Models.Entities.ThongBao entity)
    {
        return new ThongBaoResponseDto
        {
            Id = entity.Id,
            Loai = entity.Loai,
            TieuDe = entity.TieuDe,
            NoiDung = entity.NoiDung,
            DuongDan = entity.DuongDan,
            DaDoc = entity.DaDoc,
            ThoiGian = entity.ThoiGian
        };
    }
}