using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Enums;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

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
