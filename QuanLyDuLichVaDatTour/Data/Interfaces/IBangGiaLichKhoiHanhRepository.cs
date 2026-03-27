using Entity.Entities;
using Entity.Enums;

namespace DAL.Interfaces;

public interface IBangGiaLichKhoiHanhRepository
{
    Task<Dictionary<LoaiKhach, decimal>> GetBangGiaAsync(long lichKhoiHanhId, LoaiGiaApDung loaiGia);
}
