using IdentityService.Data;
using IdentityService.Models.Entities;
using IdentityService.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _dbContext;

    public UserRepository(AppDbContext dbContext)
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

    public async Task<NguoiDung?> GetByIdAsync(long id)
    {
        return await _dbContext.NguoiDungs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<NguoiDung?> GetTrackedByIdAsync(long id)
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
