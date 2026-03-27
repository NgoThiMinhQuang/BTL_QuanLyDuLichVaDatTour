using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class AnhTourRepository : IAnhTourRepository
{
    private readonly AppDbContext _dbContext;

    public AnhTourRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<AnhTour>> GetByTourIdAsync(long tourId)
    {
        return await _dbContext.AnhTours
            .AsNoTracking()
            .Where(x => x.TourId == tourId)
            .OrderBy(x => x.ThuTu)
            .ToListAsync();
    }

    public async Task<AnhTour?> GetByIdAsync(long id)
    {
        return await _dbContext.AnhTours
            .AsNoTracking()
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<AnhTour?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.AnhTours
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<AnhTour?> GetAvatarByTourIdAsync(long tourId)
    {
        return await _dbContext.AnhTours
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TourId == tourId && x.IsAvatar);
    }

    public async Task AddAsync(AnhTour anhTour)
    {
        await _dbContext.AnhTours.AddAsync(anhTour);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
