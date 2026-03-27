using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class TourDiemDenRepository : ITourDiemDenRepository
{
    private readonly AppDbContext _dbContext;

    public TourDiemDenRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<TourDiemDen>> GetByTourIdAsync(long tourId)
    {
        return await _dbContext.TourDiemDens
            .AsNoTracking()
            .Include(x => x.DiaDiem)
            .Where(x => x.TourId == tourId)
            .OrderBy(x => x.ThuTu)
            .ToListAsync();
    }

    public async Task<TourDiemDen?> GetByIdAsync(long id)
    {
        return await _dbContext.TourDiemDens
            .AsNoTracking()
            .Include(x => x.DiaDiem)
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<TourDiemDen?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.TourDiemDens
            .Include(x => x.DiaDiem)
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<TourDiemDen?> GetByTourThuTuAsync(long tourId, int thuTu)
    {
        return await _dbContext.TourDiemDens
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TourId == tourId && x.ThuTu == thuTu);
    }

    public async Task AddAsync(TourDiemDen tourDiemDen)
    {
        await _dbContext.TourDiemDens.AddAsync(tourDiemDen);
    }

    public void Delete(TourDiemDen tourDiemDen)
    {
        _dbContext.TourDiemDens.Remove(tourDiemDen);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
