using Entity.Entities;

namespace DAL.Interfaces;

public interface IDiaDiemRepository
{
    Task<List<DiaDiem>> GetAllAsync();

    Task<DiaDiem?> GetByIdAsync(ulong id);

    Task<DiaDiem?> GetTrackedByIdAsync(ulong id);

    Task<DiaDiem?> GetByTenTinhThanhQuocGiaAsync(string tenDiaDiem, string? tinhThanh, string quocGia);

    Task AddAsync(DiaDiem diaDiem);

    Task<int> SaveChangesAsync();
}
