using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class TourRepository : ITourRepository
{
    private readonly AppDbContext _dbContext;

    public TourRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Tour>> GetVisibleAsync()
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .Include(x => x.LoaiTour)
            .Include(x => x.DiemXuatPhat)
            .Include(x => x.TourDiemDens.OrderBy(td => td.ThuTu))
                .ThenInclude(x => x.DiaDiem)
            .Include(x => x.AnhTours.OrderBy(at => at.ThuTu))
            .Where(x => x.TrangThai == TrangThaiTour.dang_mo_ban)
            .OrderBy(x => x.TenTour)
            .ToListAsync();
    }

    public async Task<List<Tour>> SearchVisibleAsync(string? keyword, long? diemXuatPhatId, List<long>? loaiTourIds, List<string>? phuongTiens, decimal? minPrice, decimal? maxPrice, int? minSoNgay, int? maxSoNgay)
    {
        var query = _dbContext.Tours
            .AsNoTracking()
            .Include(x => x.LoaiTour)
            .Include(x => x.DiemXuatPhat)
            .Include(x => x.TourDiemDens.OrderBy(td => td.ThuTu))
                .ThenInclude(x => x.DiaDiem)
            .Include(x => x.AnhTours.OrderBy(at => at.ThuTu))
            .Where(x => x.TrangThai == TrangThaiTour.dang_mo_ban);

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            query = query.Where(x => x.TenTour.Contains(keyword) || x.MaTour.Contains(keyword));
        }

        if (diemXuatPhatId.HasValue)
        {
            query = query.Where(x => x.DiemXuatPhatId == diemXuatPhatId.Value);
        }

        if (loaiTourIds is not null && loaiTourIds.Count > 0)
        {
            query = query.Where(x => loaiTourIds.Contains(x.LoaiTourId));
        }

        if (phuongTiens is not null && phuongTiens.Count > 0)
        {
            query = query.Where(x => x.PhuongTien != null && phuongTiens.Any(item => x.PhuongTien.Contains(item)));
        }

        if (minPrice.HasValue)
        {
            query = query.Where(x => x.GiaTuThamKhao >= minPrice.Value);
        }

        if (maxPrice.HasValue)
        {
            query = query.Where(x => x.GiaTuThamKhao <= maxPrice.Value);
        }

        if (minSoNgay.HasValue)
        {
            query = query.Where(x => x.SoNgay >= minSoNgay.Value);
        }

        if (maxSoNgay.HasValue)
        {
            query = query.Where(x => x.SoNgay <= maxSoNgay.Value);
        }

        return await query
            .OrderBy(x => x.TenTour)
            .ToListAsync();
    }

    public async Task<Tour?> GetVisibleByIdAsync(long id)
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .Include(x => x.LoaiTour)
            .Include(x => x.DiemXuatPhat)
            .Include(x => x.TourDiemDens.OrderBy(td => td.ThuTu))
                .ThenInclude(x => x.DiaDiem)
            .Include(x => x.AnhTours.OrderBy(at => at.ThuTu))
            .FirstOrDefaultAsync(x => x.Id == id && x.TrangThai == TrangThaiTour.dang_mo_ban);
    }

    public async Task<List<Tour>> GetAllAsync()
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .Include(x => x.LoaiTour)
            .Include(x => x.DiemXuatPhat)
            .Include(x => x.TourDiemDens.OrderBy(td => td.ThuTu))
                .ThenInclude(x => x.DiaDiem)
            .Include(x => x.AnhTours.OrderBy(at => at.ThuTu))
            .OrderBy(x => x.TenTour)
            .ToListAsync();
    }

    public async Task<Tour?> GetByIdAsync(long id)
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .Include(x => x.LoaiTour)
            .Include(x => x.DiemXuatPhat)
            .Include(x => x.TourDiemDens.OrderBy(td => td.ThuTu))
                .ThenInclude(x => x.DiaDiem)
            .Include(x => x.AnhTours.OrderBy(at => at.ThuTu))
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Tour?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.Tours
            .Include(x => x.LoaiTour)
            .Include(x => x.DiemXuatPhat)
            .Include(x => x.TourDiemDens.OrderBy(td => td.ThuTu))
                .ThenInclude(x => x.DiaDiem)
            .Include(x => x.AnhTours.OrderBy(at => at.ThuTu))
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Tour?> GetByMaTourAsync(string maTour)
    {
        return await _dbContext.Tours
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.MaTour == maTour);
    }

    public async Task AddAsync(Tour tour)
    {
        await _dbContext.Tours.AddAsync(tour);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
