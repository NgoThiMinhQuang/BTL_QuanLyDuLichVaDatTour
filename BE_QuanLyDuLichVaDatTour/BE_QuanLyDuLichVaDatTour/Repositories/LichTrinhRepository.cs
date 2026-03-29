using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class LichTrinhRepository : ILichTrinhRepository
{
    private readonly AppDbContext _dbContext;

    public LichTrinhRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<LichTrinh>> GetAllAsync()
    {
        return await BuildQuery()
            .OrderBy(x => x.TourId)
            .ThenBy(x => x.NgayThu)
            .ThenBy(x => x.ThuTuTrongNgay)
            .ToListAsync();
    }

    public async Task<LichTrinh?> GetByIdAsync(long id)
    {
        return await BuildQuery()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<LichTrinh?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.LichTrinhs
            .Include(x => x.Tour)
            .Include(x => x.DiaDiem)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<LichTrinh>> GetByTourIdAsync(long tourId)
    {
        return await BuildQuery()
            .Where(x => x.TourId == tourId)
            .OrderBy(x => x.NgayThu)
            .ThenBy(x => x.ThuTuTrongNgay)
            .ToListAsync();
    }

    public async Task<List<LichTrinh>> GetVisibleByTourIdAsync(long tourId)
    {
        return await BuildQuery()
            .Where(x => x.TourId == tourId
                && x.Tour != null
                && x.Tour.TrangThai == TrangThaiTour.dang_mo_ban)
            .OrderBy(x => x.NgayThu)
            .ThenBy(x => x.ThuTuTrongNgay)
            .ToListAsync();
    }

    public async Task<LichTrinh?> GetByTourDayOrderAsync(long tourId, int ngayThu, int thuTuTrongNgay)
    {
        return await _dbContext.LichTrinhs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TourId == tourId && x.NgayThu == ngayThu && x.ThuTuTrongNgay == thuTuTrongNgay);
    }

    public async Task AddAsync(LichTrinh lichTrinh)
    {
        await _dbContext.LichTrinhs.AddAsync(lichTrinh);
    }

    public void Delete(LichTrinh lichTrinh)
    {
        _dbContext.LichTrinhs.Remove(lichTrinh);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }

    private IQueryable<LichTrinh> BuildQuery()
    {
        return _dbContext.LichTrinhs
            .AsNoTracking()
            .Include(x => x.Tour)
            .Include(x => x.DiaDiem);
    }
}
