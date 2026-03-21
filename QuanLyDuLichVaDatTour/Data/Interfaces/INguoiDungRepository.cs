using Entity.Entities;

namespace DAL.Interfaces;

public interface INguoiDungRepository
{
    Task<NguoiDung?> GetByEmailAsync(string email);

    Task AddAsync(NguoiDung nguoiDung);

    Task<int> SaveChangesAsync();
}
