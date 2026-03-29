using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class BangGiaLichKhoiHanhRepository : IBangGiaLichKhoiHanhRepository
{
    private readonly AppDbContext _dbContext;

    public BangGiaLichKhoiHanhRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Dictionary<LoaiKhach, decimal>> GetBangGiaAsync(long lichKhoiHanhId, LoaiGiaApDung loaiGia)
    {
        return await _dbContext.BangGiaLichKhoiHanhs
            .AsNoTracking()
            .Where(x => x.LichKhoiHanhId == lichKhoiHanhId && x.LoaiGia == loaiGia)
            .ToDictionaryAsync(x => x.LoaiKhach, x => x.DonGia);
    }
}
