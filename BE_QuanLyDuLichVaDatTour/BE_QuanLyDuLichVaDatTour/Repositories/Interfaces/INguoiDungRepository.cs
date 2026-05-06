using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface INguoiDungRepository
{
    Task<NguoiDung?> GetByIdAsync(long id);

    Task<NguoiDung?> GetByIdTrackedAsync(long id);

    Task<NguoiDung?> GetByEmailAsync(string email);

    Task<List<NguoiDung>> GetAllAsync();

    Task<List<NguoiDung>> SearchAsync(string? keyword, VaiTroNguoiDung? vaiTro, TrangThaiNguoiDung? trangThai, int page, int pageSize);

    Task<int> CountAsync(string? keyword, VaiTroNguoiDung? vaiTro, TrangThaiNguoiDung? trangThai);

    Task AddAsync(NguoiDung nguoiDung);

    Task<int> SaveChangesAsync();
}
