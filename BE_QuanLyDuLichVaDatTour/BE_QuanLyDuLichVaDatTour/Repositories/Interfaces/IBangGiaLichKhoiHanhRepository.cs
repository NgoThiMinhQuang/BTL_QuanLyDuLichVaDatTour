using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface IBangGiaLichKhoiHanhRepository
{
    Task<Dictionary<LoaiKhach, decimal>> GetBangGiaAsync(long lichKhoiHanhId, LoaiGiaApDung loaiGia);
}
