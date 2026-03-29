using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class NguoiDungRepository : INguoiDungRepository
{
    private readonly AppDbContext _dbContext;

    public NguoiDungRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<NguoiDung?> GetByIdAsync(long id)
    {
        return await _dbContext.NguoiDungs
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}
