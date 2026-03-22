using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class TourRepository : ITourRepository
{
    private readonly AppDbContext _dbContext;

    public TourRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Tour>> GetVisibleAsync()
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .Include(x => x.LoaiTour)
            .Include(x => x.DiaDiemKhoiHanh)
            .Where(x => x.TrangThai == TrangThaiTour.dang_mo_ban)
            .OrderBy(x => x.TenTour)
            .ToListAsync();
    }

    public async Task<Tour?> GetVisibleByIdAsync(ulong id)
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .Include(x => x.LoaiTour)
            .Include(x => x.DiaDiemKhoiHanh)
            .FirstOrDefaultAsync(x => x.Id == id && x.TrangThai == TrangThaiTour.dang_mo_ban);
    }

    public async Task<List<Tour>> GetAllAsync()
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .Include(x => x.LoaiTour)
            .Include(x => x.DiaDiemKhoiHanh)
            .OrderBy(x => x.TenTour)
            .ToListAsync();
    }

    public async Task<Tour?> GetByIdAsync(ulong id)
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .Include(x => x.LoaiTour)
            .Include(x => x.DiaDiemKhoiHanh)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Tour?> GetTrackedByIdAsync(ulong id)
    {
        return await _dbContext.Tours
            .Include(x => x.LoaiTour)
            .Include(x => x.DiaDiemKhoiHanh)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Tour?> GetByMaTourAsync(string maTour)
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.MaTour == maTour);
    }

    public async Task AddAsync(Tour tour)
    {
        await _dbContext.Tours.AddAsync(tour);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
