using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class NguoiDungRepository : INguoiDungRepository
{
    private readonly AppDbContext _dbContext;

    public NguoiDungRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<NguoiDung?> GetByEmailAsync(string email)
    {
        return await _dbContext.NguoiDungs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task<NguoiDung?> GetTrackedByEmailAsync(string email)
    {
        return await _dbContext.NguoiDungs
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task<NguoiDung?> GetByIdAsync(ulong id)
    {
        return await _dbContext.NguoiDungs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<NguoiDung?> GetTrackedByIdAsync(ulong id)
    {
        return await _dbContext.NguoiDungs
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task AddAsync(NguoiDung nguoiDung)
    {
        await _dbContext.NguoiDungs.AddAsync(nguoiDung);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
