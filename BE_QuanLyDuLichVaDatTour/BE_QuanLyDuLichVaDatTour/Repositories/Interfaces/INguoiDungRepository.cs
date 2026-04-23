using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface INguoiDungRepository
{
    Task<NguoiDung?> GetByIdAsync(long id);

    Task<List<NguoiDung>> GetAllAsync();
}
