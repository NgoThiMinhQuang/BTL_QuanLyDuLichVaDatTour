using IdentityService.Models.Entities;

namespace IdentityService.Repositories.Interfaces;

public interface IUserRepository
{
    Task<NguoiDung?> GetByEmailAsync(string email);

    Task<NguoiDung?> GetTrackedByEmailAsync(string email);

    Task<NguoiDung?> GetByIdAsync(long id);

    Task<NguoiDung?> GetTrackedByIdAsync(long id);

    Task AddAsync(NguoiDung nguoiDung);

    Task<int> SaveChangesAsync();
}
