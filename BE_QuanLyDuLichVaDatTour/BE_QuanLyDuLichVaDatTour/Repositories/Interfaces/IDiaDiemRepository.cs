using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface IDiaDiemRepository
{
    Task<List<DiaDiem>> GetVisibleAsync();

    Task<DiaDiem?> GetVisibleByIdAsync(long id);

    Task<List<DiaDiem>> GetAllAsync();

    Task<DiaDiem?> GetByIdAsync(long id);

    Task<DiaDiem?> GetTrackedByIdAsync(long id);

    Task<DiaDiem?> GetByTenTinhThanhQuocGiaAsync(string tenDiaDiem, string? tinhThanh, string quocGia);

    Task AddAsync(DiaDiem diaDiem);

    Task<int> SaveChangesAsync();
}
