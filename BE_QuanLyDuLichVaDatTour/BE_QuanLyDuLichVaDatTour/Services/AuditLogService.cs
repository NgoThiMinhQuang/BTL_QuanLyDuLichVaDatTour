using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.Admin;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class AuditLogService : IAuditLogService
{
    private readonly AppDbContext _dbContext;

    public AuditLogService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task LogAsync(long? nguoiDungId, string? hoTenNguoiDung, string hanhDong, string bang, long? banGhiId, string? chiTiet, string? diaChiIp, string? userAgent)
    {
        var entry = new NhatKyHeThong
        {
            NguoiDungId = nguoiDungId,
            HoTenNguoiDung = hoTenNguoiDung,
            HanhDong = hanhDong,
            Bang = bang,
            BanGhiId = banGhiId,
            ChiTiet = chiTiet,
            DiaChiIp = diaChiIp,
            UserAgent = userAgent,
            ThoiGian = DateTime.UtcNow,
        };

        _dbContext.NhatKyHeThongs.Add(entry);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<AuditLogListResponseDto> SearchAsync(SearchAuditLogRequestDto request)
    {
        var query = _dbContext.NhatKyHeThongs.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            var kw = request.Keyword.Trim().ToLower();
            query = query.Where(x =>
                (x.HoTenNguoiDung != null && x.HoTenNguoiDung.ToLower().Contains(kw)) ||
                x.HanhDong.ToLower().Contains(kw) ||
                x.Bang.ToLower().Contains(kw) ||
                (x.ChiTiet != null && x.ChiTiet.ToLower().Contains(kw)));
        }

        if (!string.IsNullOrWhiteSpace(request.HanhDong))
        {
            query = query.Where(x => x.HanhDong == request.HanhDong);
        }

        if (!string.IsNullOrWhiteSpace(request.Bang))
        {
            query = query.Where(x => x.Bang == request.Bang);
        }

        if (!string.IsNullOrWhiteSpace(request.TuNgay) && DateTime.TryParse(request.TuNgay, out var tuNgay))
        {
            query = query.Where(x => x.ThoiGian >= tuNgay);
        }

        if (!string.IsNullOrWhiteSpace(request.DenNgay) && DateTime.TryParse(request.DenNgay, out var denNgay))
        {
            query = query.Where(x => x.ThoiGian <= denNgay);
        }

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(x => x.ThoiGian)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return new AuditLogListResponseDto
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        };
    }

    private static NhatKyHeThongDto MapToDto(NhatKyHeThong item)
    {
        return new NhatKyHeThongDto
        {
            Id = item.Id,
            NguoiDungId = item.NguoiDungId,
            HoTenNguoiDung = item.HoTenNguoiDung,
            HanhDong = item.HanhDong,
            Bang = item.Bang,
            BanGhiId = item.BanGhiId,
            ChiTiet = item.ChiTiet,
            DiaChiIp = item.DiaChiIp,
            ThoiGian = item.ThoiGian,
        };
    }
}