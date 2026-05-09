using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.ThongBao;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
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

    public async Task<int> BroadcastAsync(long adminUserId, BroadcastNotificationRequestDto request)
    {
        var now = DateTime.UtcNow;
        var count = 0;

        if (request.UserId.HasValue)
        {
            var thongBao = new Models.Entities.ThongBao
            {
                UserId = request.UserId.Value,
                Loai = request.Loai,
                TieuDe = request.TieuDe,
                NoiDung = request.NoiDung,
                DuongDan = request.DuongDan,
                DaDoc = false,
                ThoiGian = now
            };
            await _repo.AddAsync(thongBao);
            count = 1;
        }
        else
        {
            var allUsers = _context.NguoiDungs
                .Where(u => u.TrangThai == Models.Enums.TrangThaiNguoiDung.hoat_dong)
                .Select(u => u.Id)
                .ToList();

            var thongBaos = allUsers.Select(userId => new Models.Entities.ThongBao
            {
                UserId = userId,
                Loai = request.Loai,
                TieuDe = request.TieuDe,
                NoiDung = request.NoiDung,
                DuongDan = request.DuongDan,
                DaDoc = false,
                ThoiGian = now
            }).ToList();

            await _repo.AddRangeAsync(thongBaos);
            count = thongBaos.Count;
        }

        await _repo.SaveChangesAsync();
        return count;
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