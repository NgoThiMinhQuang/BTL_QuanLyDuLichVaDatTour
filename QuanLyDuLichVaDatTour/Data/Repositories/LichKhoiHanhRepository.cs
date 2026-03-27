using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class LichKhoiHanhRepository : ILichKhoiHanhRepository
{
    private readonly AppDbContext _dbContext;

    public LichKhoiHanhRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<LichKhoiHanh>> GetAllAsync()
    {
        return await _dbContext.LichKhoiHanhs
            .AsNoTracking()
            .Include(x => x.Tour)
            .OrderBy(x => x.NgayKhoiHanh)
            .ThenBy(x => x.MaDotTour)
            .ToListAsync();
    }

    public async Task<LichKhoiHanh?> GetByIdAsync(long id)
    {
        return await _dbContext.LichKhoiHanhs
            .AsNoTracking()
            .Include(x => x.Tour)
                .ThenInclude(x => x!.LoaiTour)
            .Include(x => x.Tour)
                .ThenInclude(x => x!.DiemXuatPhat)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<LichKhoiHanh?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.LichKhoiHanhs
            .Include(x => x.Tour)
                .ThenInclude(x => x!.LoaiTour)
            .Include(x => x.Tour)
                .ThenInclude(x => x!.DiemXuatPhat)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<LichKhoiHanh>> GetByTourIdAsync(long tourId)
    {
        return await _dbContext.LichKhoiHanhs
            .AsNoTracking()
            .Include(x => x.Tour)
            .Where(x => x.TourId == tourId)
            .OrderBy(x => x.NgayKhoiHanh)
            .ThenBy(x => x.MaDotTour)
            .ToListAsync();
    }

    public async Task<List<LichKhoiHanh>> GetVisibleByTourIdAsync(long tourId)
    {
        return await _dbContext.LichKhoiHanhs
            .AsNoTracking()
            .Include(x => x.Tour)
            .Where(x => x.TourId == tourId
                && x.TrangThai == TrangThaiLichKhoiHanh.mo_ban
                && x.Tour != null
                && x.Tour.TrangThai == TrangThaiTour.dang_mo_ban)
            .OrderBy(x => x.NgayKhoiHanh)
            .ThenBy(x => x.MaDotTour)
            .ToListAsync();
    }

    public async Task<LichKhoiHanh?> GetByMaDotTourAsync(string maDotTour)
    {
        return await _dbContext.LichKhoiHanhs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.MaDotTour == maDotTour);
    }

    public async Task AddAsync(LichKhoiHanh lichKhoiHanh)
    {
        await _dbContext.LichKhoiHanhs.AddAsync(lichKhoiHanh);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
