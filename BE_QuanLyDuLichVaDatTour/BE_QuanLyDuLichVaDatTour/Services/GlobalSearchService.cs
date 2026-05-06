using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.Admin;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class GlobalSearchService : IGlobalSearchService
{
    private readonly AppDbContext _dbContext;

    public GlobalSearchService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<GlobalSearchResponseDto> SearchAsync(GlobalSearchRequestDto request)
    {
        var q = request.Q.Trim().ToLower();
        var response = new GlobalSearchResponseDto();

        if (request.Modules == null || request.Modules.Count == 0 || request.Modules.Contains("tours"))
        {
            response.Tours = await SearchToursAsync(q);
        }

        if (request.Modules == null || request.Modules.Count == 0 || request.Modules.Contains("bookings"))
        {
            response.Bookings = await SearchBookingsAsync(q);
        }

        if (request.Modules == null || request.Modules.Count == 0 || request.Modules.Contains("customers"))
        {
            response.Customers = await SearchCustomersAsync(q);
        }

        if (request.Modules == null || request.Modules.Count == 0 || request.Modules.Contains("vouchers"))
        {
            response.Vouchers = await SearchVouchersAsync(q);
        }

        if (request.Modules == null || request.Modules.Count == 0 || request.Modules.Contains("lich-khoi-hanh"))
        {
            response.LichKhoiHanhs = await SearchLichKhoiHanhsAsync(q);
        }

        if (request.Modules == null || request.Modules.Count == 0 || request.Modules.Contains("tin-tuc"))
        {
            response.TinTucs = await SearchTinTucsAsync(q);
        }

        response.TotalCount =
            response.Tours.Count +
            response.Bookings.Count +
            response.Customers.Count +
            response.Vouchers.Count +
            response.LichKhoiHanhs.Count +
            response.TinTucs.Count;

        return response;
    }

    private async Task<List<GlobalSearchResultDto>> SearchToursAsync(string q)
    {
        var tours = await _dbContext.Tours
            .AsNoTracking()
            .Include(t => t.LoaiTour)
            .Where(t =>
                t.TenTour.ToLower().Contains(q) ||
                t.MaTour.ToLower().Contains(q))
            .Take(5)
            .ToListAsync();

        return tours.Select(t => new GlobalSearchResultDto
        {
            Module = "tours",
            Label = t.TenTour,
            Description = $"{t.MaTour} • {t.LoaiTour?.Ten}",
            Status = t.TrangThai.ToString(),
            Url = $"/admin/tours",
            Icon = "tags"
        }).ToList();
    }

    private async Task<List<GlobalSearchResultDto>> SearchBookingsAsync(string q)
    {
        var bookings = await _dbContext.Bookings
            .AsNoTracking()
            .Include(b => b.LichKhoiHanh).ThenInclude(l => l.Tour)
            .Where(b =>
                b.MaBooking.ToLower().Contains(q) ||
                b.HoTenLienHe.ToLower().Contains(q) ||
                b.SoDienThoaiLienHe.Contains(q))
            .Take(5)
            .ToListAsync();

        return bookings.Select(b => new GlobalSearchResultDto
        {
            Module = "bookings",
            Label = b.MaBooking,
            Description = $"{b.HoTenLienHe} • {b.LichKhoiHanh?.Tour?.TenTour}",
            Status = b.TrangThaiBooking.ToString(),
            Url = $"/admin/bookings",
            Icon = "team"
        }).ToList();
    }

    private async Task<List<GlobalSearchResultDto>> SearchCustomersAsync(string q)
    {
        var customers = await _dbContext.NguoiDungs
            .AsNoTracking()
            .Where(u =>
                u.HoTen.ToLower().Contains(q) ||
                u.Email.ToLower().Contains(q) ||
                (u.SoDienThoai != null && u.SoDienThoai.Contains(q)))
            .Take(5)
            .ToListAsync();

        return customers.Select(c => new GlobalSearchResultDto
        {
            Module = "customers",
            Label = c.HoTen,
            Description = $"{c.Email} • {c.SoDienThoai ?? "—"}",
            Status = c.TrangThai.ToString(),
            Url = $"/admin/khach-hang",
            Icon = "user"
        }).ToList();
    }

    private async Task<List<GlobalSearchResultDto>> SearchVouchersAsync(string q)
    {
        var vouchers = await _dbContext.Vouchers
            .AsNoTracking()
            .Where(v =>
                v.MaVoucher.ToLower().Contains(q) ||
                v.TenVoucher.ToLower().Contains(q))
            .Take(5)
            .ToListAsync();

        return vouchers.Select(v => new GlobalSearchResultDto
        {
            Module = "vouchers",
            Label = v.MaVoucher,
            Description = v.TenVoucher,
            Status = v.TrangThai.ToString(),
            Url = $"/admin/vouchers",
            Icon = "gift"
        }).ToList();
    }

    private async Task<List<GlobalSearchResultDto>> SearchLichKhoiHanhsAsync(string q)
    {
        var schedules = await _dbContext.LichKhoiHanhs
            .AsNoTracking()
            .Include(l => l.Tour)
            .Where(l =>
                l.MaDotTour.ToLower().Contains(q) ||
                (l.Tour != null && l.Tour.TenTour.ToLower().Contains(q)))
            .Take(5)
            .ToListAsync();

        return schedules.Select(l => new GlobalSearchResultDto
        {
            Module = "lich-khoi-hanh",
            Label = l.MaDotTour,
            Description = l.Tour?.TenTour,
            Status = l.TrangThai.ToString(),
            Url = $"/admin/lich-khoi-hanh",
            Icon = "calendar"
        }).ToList();
    }

    private async Task<List<GlobalSearchResultDto>> SearchTinTucsAsync(string q)
    {
        var news = await _dbContext.TinTucs
            .AsNoTracking()
            .Where(n =>
                n.TieuDe.ToLower().Contains(q) ||
                n.Slug.ToLower().Contains(q))
            .Take(5)
            .ToListAsync();

        return news.Select(n => new GlobalSearchResultDto
        {
            Module = "tin-tuc",
            Label = n.TieuDe,
            Description = n.Slug,
            Status = n.TrangThai.ToString(),
            Url = $"/admin/tin-tuc",
            Icon = "read"
        }).ToList();
    }
}