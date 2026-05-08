using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class LienHeRepository : ILienHeRepository
{
    private readonly AppDbContext _dbContext;

    public LienHeRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<LienHe?> GetByIdAsync(long id)
    {
        return await _dbContext.LienHes
            .AsNoTracking()
            .Include(x => x.NguoiXuLy)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<LienHe?> GetByIdTrackedAsync(long id)
    {
        return await _dbContext.LienHes
            .Include(x => x.NguoiXuLy)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<LienHe>> SearchAsync(string? keyword, TrangThaiLienHe? trangThai, int page, int pageSize)
    {
        IQueryable<LienHe> query = _dbContext.LienHes.AsNoTracking().Include(x => x.NguoiXuLy);

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var kw = keyword.Trim().ToLower();
            query = query.Where(x =>
                x.HoTen.ToLower().Contains(kw) ||
                x.Email.ToLower().Contains(kw) ||
                x.ChuDe.ToLower().Contains(kw) ||
                x.NoiDung.ToLower().Contains(kw) ||
                (x.SoDienThoai != null && x.SoDienThoai.Contains(kw)));
        }

        if (trangThai.HasValue)
        {
            query = query.Where(x => x.TrangThai == trangThai.Value);
        }

        return await query
            .OrderByDescending(x => x.NgayGui)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> CountAsync(string? keyword, TrangThaiLienHe? trangThai)
    {
        IQueryable<LienHe> query = _dbContext.LienHes.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var kw = keyword.Trim().ToLower();
            query = query.Where(x =>
                x.HoTen.ToLower().Contains(kw) ||
                x.Email.ToLower().Contains(kw) ||
                x.ChuDe.ToLower().Contains(kw) ||
                x.NoiDung.ToLower().Contains(kw) ||
                (x.SoDienThoai != null && x.SoDienThoai.Contains(kw)));
        }

        if (trangThai.HasValue)
        {
            query = query.Where(x => x.TrangThai == trangThai.Value);
        }

        return await query.CountAsync();
    }

    public async Task AddAsync(LienHe lienHe)
    {
        await _dbContext.LienHes.AddAsync(lienHe);
    }

    public async Task<List<LienHe>> GetByEmailAsync(string email)
    {
        return await _dbContext.LienHes
            .AsNoTracking()
            .Include(x => x.NguoiXuLy)
            .Where(x => x.Email == email)
            .OrderByDescending(x => x.NgayGui)
            .ToListAsync();
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _dbContext.SaveChangesAsync();
    }
}