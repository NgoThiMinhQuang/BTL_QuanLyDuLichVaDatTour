using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _dbContext;

    public BookingRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Booking booking)
    {
        await _dbContext.Bookings.AddAsync(booking);
    }

    public async Task<Booking?> GetByIdAsync(long id)
    {
        return await _dbContext.Bookings
            .AsNoTracking()
            .Include(x => x.LichKhoiHanh)
                .ThenInclude(x => x!.Tour)
            .Include(x => x.KhachHang)
            .Include(x => x.Voucher)
            .Include(x => x.HanhKhachs)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Booking?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.Bookings
            .Include(x => x.LichKhoiHanh)
                .ThenInclude(x => x!.Tour)
            .Include(x => x.KhachHang)
            .Include(x => x.Voucher)
            .Include(x => x.HanhKhachs)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Booking?> GetByMaBookingAsync(string maBooking)
    {
        return await _dbContext.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.MaBooking == maBooking);
    }

    public async Task<List<Booking>> GetByNguoiDungIdAsync(long nguoiDungId)
    {
        return await _dbContext.Bookings
            .AsNoTracking()
            .Include(x => x.LichKhoiHanh)
                .ThenInclude(x => x!.Tour)
            .Include(x => x.Voucher)
            .Include(x => x.HanhKhachs)
            .Where(x => x.KhachHangId == nguoiDungId)
            .OrderByDescending(x => x.NgayDat)
            .ToListAsync();
    }

    public async Task<List<Booking>> GetAllAsync()
    {
        return await _dbContext.Bookings
            .AsNoTracking()
            .Include(x => x.LichKhoiHanh)
                .ThenInclude(x => x!.Tour)
            .Include(x => x.KhachHang)
            .Include(x => x.Voucher)
            .Include(x => x.HanhKhachs)
            .OrderByDescending(x => x.NgayDat)
            .ToListAsync();
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
