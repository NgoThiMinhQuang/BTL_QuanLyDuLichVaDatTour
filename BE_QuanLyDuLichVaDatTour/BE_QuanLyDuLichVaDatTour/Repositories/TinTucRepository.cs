using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class TinTucRepository : ITinTucRepository
{
    private readonly AppDbContext _dbContext;

    public TinTucRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<TinTuc>> GetVisibleAsync()
    {
        return await _dbContext.TinTucs
            .AsNoTracking()
            .Where(x => x.TrangThai == TrangThaiTinTuc.hoat_dong)
            .OrderByDescending(x => x.NgayDang)
            .ThenByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<TinTuc?> GetVisibleByIdAsync(long id)
    {
        return await _dbContext.TinTucs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.TrangThai == TrangThaiTinTuc.hoat_dong);
    }

    public async Task<List<TinTuc>> GetAllAsync()
    {
        return await _dbContext.TinTucs
            .AsNoTracking()
            .OrderByDescending(x => x.NgayDang)
            .ThenByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<TinTuc?> GetByIdAsync(long id)
    {
        return await _dbContext.TinTucs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<TinTuc?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.TinTucs
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<TinTuc?> GetBySlugAsync(string slug)
    {
        return await _dbContext.TinTucs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Slug == slug);
    }

    public async Task AddAsync(TinTuc tinTuc)
    {
        await _dbContext.TinTucs.AddAsync(tinTuc);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
