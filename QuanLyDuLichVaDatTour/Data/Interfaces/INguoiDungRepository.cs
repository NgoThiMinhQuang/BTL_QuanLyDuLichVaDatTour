using Entity.Entities;

namespace DAL.Interfaces;

public interface INguoiDungRepository
{
    Task<NguoiDung?> GetByEmailAsync(string email);

    Task<NguoiDung?> GetTrackedByEmailAsync(string email);

    Task<NguoiDung?> GetByIdAsync(ulong id);

    Task<NguoiDung?> GetTrackedByIdAsync(ulong id);

    Task AddAsync(NguoiDung nguoiDung);

    Task<int> SaveChangesAsync();
}
