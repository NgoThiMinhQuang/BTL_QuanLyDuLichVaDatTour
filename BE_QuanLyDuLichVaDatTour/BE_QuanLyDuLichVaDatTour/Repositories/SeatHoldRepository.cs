using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class SeatHoldRepository : ISeatHoldRepository
{
    private readonly AppDbContext _dbContext;

    public SeatHoldRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(SeatHold hold)
    {
        await _dbContext.SeatHolds.AddAsync(hold);
    }

    public async Task<SeatHold?> GetByTokenAsync(string token)
    {
        return await _dbContext.SeatHolds
            .AsNoTracking()
            .FirstOrDefaultAsync(h => h.HoldToken == token);
    }

    public async Task<SeatHold?> GetActiveHoldAsync(long lichKhoiHanhId, long khachHangId)
    {
        var now = DateTime.UtcNow;
        return await _dbContext.SeatHolds
            .AsNoTracking()
            .FirstOrDefaultAsync(h => h.LichKhoiHanhId == lichKhoiHanhId
                                      && h.KhachHangId == khachHangId
                                      && h.TrangThai == "active"
                                      && h.ExpiresAt > now);
    }

    public async Task<SeatHold?> GetTrackedByTokenAsync(string token)
    {
        return await _dbContext.SeatHolds
            .FirstOrDefaultAsync(h => h.HoldToken == token);
    }

    public async Task<int> GetHeldSeatsAsync(long lichKhoiHanhId)
    {
        var now = DateTime.UtcNow;
        var holds = await _dbContext.SeatHolds
            .AsNoTracking()
            .Where(h => h.LichKhoiHanhId == lichKhoiHanhId
                        && h.TrangThai == "active"
                        && h.ExpiresAt > now)
            .ToListAsync();

        return holds.Sum(h => (int)h.SoCho);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}