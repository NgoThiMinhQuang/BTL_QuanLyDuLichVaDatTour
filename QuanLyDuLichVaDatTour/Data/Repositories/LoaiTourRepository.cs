using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class LoaiTourRepository : ILoaiTourRepository
{
    private readonly AppDbContext _dbContext;

    public LoaiTourRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<LoaiTour>> GetVisibleAsync()
    {
        return await _dbContext.LoaiTours
            .AsNoTracking()
            .Where(x => x.TrangThai == TrangThaiLoaiTour.hoat_dong)
            .OrderBy(x => x.Ten)
            .ToListAsync();
    }

    public async Task<LoaiTour?> GetVisibleByIdAsync(long id)
    {
        return await _dbContext.LoaiTours
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.TrangThai == TrangThaiLoaiTour.hoat_dong);
    }

    public async Task<List<LoaiTour>> GetAllAsync()
    {
        return await _dbContext.LoaiTours
            .AsNoTracking()
            .OrderBy(x => x.Ten)
            .ToListAsync();
    }

    public async Task<LoaiTour?> GetByIdAsync(long id)
    {
        return await _dbContext.LoaiTours
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<LoaiTour?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.LoaiTours
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<LoaiTour?> GetByTenAsync(string ten)
    {
        return await _dbContext.LoaiTours
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Ten == ten);
    }

    public async Task AddAsync(LoaiTour loaiTour)
    {
        await _dbContext.LoaiTours.AddAsync(loaiTour);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
