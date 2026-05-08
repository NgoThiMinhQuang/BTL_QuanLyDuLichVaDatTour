using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface ILienHeRepository
{
    Task<LienHe?> GetByIdAsync(long id);
    Task<LienHe?> GetByIdTrackedAsync(long id);
    Task<List<LienHe>> SearchAsync(string? keyword, TrangThaiLienHe? trangThai, int page, int pageSize);
    Task<int> CountAsync(string? keyword, TrangThaiLienHe? trangThai);
    Task AddAsync(LienHe lienHe);
    Task<List<LienHe>> GetByEmailAsync(string email);
    Task<int> SaveChangesAsync();
}