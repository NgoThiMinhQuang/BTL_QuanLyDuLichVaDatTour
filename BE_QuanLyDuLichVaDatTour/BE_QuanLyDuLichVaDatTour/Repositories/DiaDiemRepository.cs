using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class DiaDiemRepository : IDiaDiemRepository
{
    private readonly AppDbContext _dbContext;

    public DiaDiemRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<DiaDiem>> GetVisibleAsync()
    {
        return await _dbContext.DiaDiems
            .AsNoTracking()
            .Where(x => x.TrangThai == TrangThaiDiaDiem.hoat_dong)
            .OrderBy(x => x.QuocGia)
            .ThenBy(x => x.TinhThanh)
            .ThenBy(x => x.TenDiaDiem)
            .ToListAsync();
    }

    public async Task<DiaDiem?> GetVisibleByIdAsync(long id)
    {
        return await _dbContext.DiaDiems
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id && x.TrangThai == TrangThaiDiaDiem.hoat_dong);
    }

    public async Task<List<DiaDiem>> GetAllAsync()
    {
        return await _dbContext.DiaDiems
            .AsNoTracking()
            .OrderBy(x => x.QuocGia)
            .ThenBy(x => x.TinhThanh)
            .ThenBy(x => x.TenDiaDiem)
            .ToListAsync();
    }

    public async Task<DiaDiem?> GetByIdAsync(long id)
    {
        return await _dbContext.DiaDiems
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<DiaDiem?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.DiaDiems
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<DiaDiem?> GetByTenTinhThanhQuocGiaAsync(string tenDiaDiem, string? tinhThanh, string quocGia)
    {
        return await _dbContext.DiaDiems
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.TenDiaDiem == tenDiaDiem
                && x.TinhThanh == tinhThanh
                && x.QuocGia == quocGia);
    }

    public async Task AddAsync(DiaDiem diaDiem)
    {
        await _dbContext.DiaDiems.AddAsync(diaDiem);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
