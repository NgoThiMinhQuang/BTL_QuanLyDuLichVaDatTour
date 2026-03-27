using Entity.Entities;

namespace DAL.Interfaces;

public interface INguoiDungRepository
{
    Task<NguoiDung?> GetByEmailAsync(string email);

    Task<NguoiDung?> GetTrackedByEmailAsync(string email);

    Task<NguoiDung?> GetByIdAsync(long id);

    Task<NguoiDung?> GetTrackedByIdAsync(long id);

    Task AddAsync(NguoiDung nguoiDung);

    Task<int> SaveChangesAsync();
}
