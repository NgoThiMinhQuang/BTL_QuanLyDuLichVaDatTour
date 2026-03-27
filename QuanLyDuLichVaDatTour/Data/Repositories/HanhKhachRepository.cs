using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class HanhKhachRepository : IHanhKhachRepository
{
    private readonly AppDbContext _dbContext;

    public HanhKhachRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<HanhKhach>> GetByBookingIdAsync(long bookingId)
    {
        return await _dbContext.HanhKhachs
            .AsNoTracking()
            .Where(x => x.BookingId == bookingId)
            .OrderBy(x => x.Id)
            .ToListAsync();
    }

    public async Task<HanhKhach?> GetByIdAsync(long id)
    {
        return await _dbContext.HanhKhachs
            .AsNoTracking()
            .Include(x => x.Booking)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<HanhKhach?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.HanhKhachs
            .Include(x => x.Booking)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task AddAsync(HanhKhach hanhKhach)
    {
        await _dbContext.HanhKhachs.AddAsync(hanhKhach);
    }

    public async Task AddRangeAsync(IEnumerable<HanhKhach> hanhKhachs)
    {
        await _dbContext.HanhKhachs.AddRangeAsync(hanhKhachs);
    }

    public void Delete(HanhKhach hanhKhach)
    {
        _dbContext.HanhKhachs.Remove(hanhKhach);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
