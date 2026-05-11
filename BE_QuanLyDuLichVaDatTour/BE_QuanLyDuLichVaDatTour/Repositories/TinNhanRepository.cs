using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class TinNhanRepository : ITinNhanRepository
{
    private readonly AppDbContext _dbContext;

    public TinNhanRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(TinNhan tinNhan)
    {
        await _dbContext.TinNhans.AddAsync(tinNhan);
    }

    public async Task<List<TinNhan>> GetByBookingIdAsync(long bookingId)
    {
        return await _dbContext.TinNhans
            .AsNoTracking()
            .Include(x => x.NguoiGui)
            .Where(x => x.BookingId == bookingId)
            .OrderBy(x => x.ThoiGianGui)
            .ToListAsync();
    }

    public async Task<List<TinNhan>> GetGeneralMessagesAsync(long userId, bool isAdmin)
    {
        if (isAdmin)
        {
            return await GeneralMessagesQuery()
                .OrderBy(x => x.ThoiGianGui)
                .ToListAsync();
        }

        return await GeneralMessagesQuery()
            .Where(x => x.KhachHangId == userId)
            .OrderBy(x => x.ThoiGianGui)
            .ToListAsync();
    }

    public async Task<List<TinNhan>> GetAllGeneralWithNguoiGuiAsync()
    {
        return await GeneralMessagesQuery()
            .Include(x => x.KhachHang)
            .OrderBy(x => x.ThoiGianGui)
            .ToListAsync();
    }

    public async Task<List<TinNhan>> GetGeneralByKhachHangIdAsync(long khachHangId)
    {
        return await GeneralMessagesQuery()
            .Where(x => x.KhachHangId == khachHangId)
            .OrderBy(x => x.ThoiGianGui)
            .ToListAsync();
    }

    public async Task MarkAsReadAsync(long bookingId, long userId)
    {
        var messages = await _dbContext.TinNhans
            .Where(x => x.BookingId == bookingId && x.NguoiGuiId != userId && !x.DaDoc)
            .ToListAsync();

        foreach (var msg in messages)
        {
            msg.DaDoc = true;
        }

        await _dbContext.SaveChangesAsync();
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }

    private IQueryable<TinNhan> GeneralMessagesQuery()
    {
        return _dbContext.TinNhans
            .AsNoTracking()
            .Include(x => x.NguoiGui)
            .Where(x => x.BookingId == null);
    }
}
