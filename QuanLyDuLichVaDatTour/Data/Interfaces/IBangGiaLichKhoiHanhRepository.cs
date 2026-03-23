using Entity.Entities;
using Entity.Enums;

namespace DAL.Interfaces;

public interface IBangGiaLichKhoiHanhRepository
{
    Task<Dictionary<LoaiKhach, decimal>> GetBangGiaAsync(ulong lichKhoiHanhId, LoaiGiaApDung loaiGia);
}
