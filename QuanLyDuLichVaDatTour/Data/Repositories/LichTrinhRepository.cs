using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class LichTrinhRepository : ILichTrinhRepository
{
    private readonly AppDbContext _dbContext;

    public LichTrinhRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<LichTrinh>> GetAllAsync()
    {
        return await _dbContext.LichTrinhs
            .AsNoTracking()
            .Include(x => x.Tour)
            .Include(x => x.DiaDiem)
            .OrderBy(x => x.TourId)
            .ThenBy(x => x.NgayThu)
            .ThenBy(x => x.ThuTuTrongNgay)
            .ToListAsync();
    }

    public async Task<LichTrinh?> GetByIdAsync(ulong id)
    {
        return await _dbContext.LichTrinhs
            .AsNoTracking()
            .Include(x => x.Tour)
            .Include(x => x.DiaDiem)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<LichTrinh?> GetTrackedByIdAsync(ulong id)
    {
        return await _dbContext.LichTrinhs
            .Include(x => x.Tour)
            .Include(x => x.DiaDiem)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<LichTrinh>> GetByTourIdAsync(ulong tourId)
    {
        return await _dbContext.LichTrinhs
            .AsNoTracking()
            .Include(x => x.Tour)
            .Include(x => x.DiaDiem)
            .Where(x => x.TourId == tourId)
            .OrderBy(x => x.NgayThu)
            .ThenBy(x => x.ThuTuTrongNgay)
            .ToListAsync();
    }

    public async Task<List<LichTrinh>> GetVisibleByTourIdAsync(ulong tourId)
    {
        return await _dbContext.LichTrinhs
            .AsNoTracking()
            .Include(x => x.Tour)
            .Include(x => x.DiaDiem)
            .Where(x => x.TourId == tourId && x.Tour != null && x.Tour.TrangThai == TrangThaiTour.dang_mo_ban)
            .OrderBy(x => x.NgayThu)
            .ThenBy(x => x.ThuTuTrongNgay)
            .ToListAsync();
    }

    public async Task<LichTrinh?> GetByTourDayOrderAsync(ulong tourId, byte ngayThu, ushort thuTuTrongNgay)
    {
        return await _dbContext.LichTrinhs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TourId == tourId && x.NgayThu == ngayThu && x.ThuTuTrongNgay == thuTuTrongNgay);
    }

    public async Task AddAsync(LichTrinh lichTrinh)
    {
        await _dbContext.LichTrinhs.AddAsync(lichTrinh);
    }

    public void Delete(LichTrinh lichTrinh)
    {
        _dbContext.LichTrinhs.Remove(lichTrinh);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
