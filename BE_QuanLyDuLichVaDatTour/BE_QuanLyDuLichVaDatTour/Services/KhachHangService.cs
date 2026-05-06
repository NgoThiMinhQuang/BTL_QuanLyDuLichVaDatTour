using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.KhachHang;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class KhachHangService : IKhachHangService
{
    private readonly INguoiDungRepository _nguoiDungRepository;
    private readonly AppDbContext _dbContext;

    public KhachHangService(INguoiDungRepository nguoiDungRepository, AppDbContext dbContext)
    {
        _nguoiDungRepository = nguoiDungRepository;
        _dbContext = dbContext;
    }

    public async Task<KhachHangListResponseDto> SearchAsync(SearchKhachHangRequestDto request)
    {
        VaiTroNguoiDung? vaiTro = null;
        if (!string.IsNullOrWhiteSpace(request.VaiTro) && Enum.TryParse<VaiTroNguoiDung>(request.VaiTro, true, out var vt))
        {
            vaiTro = vt;
        }

        TrangThaiNguoiDung? trangThai = null;
        if (!string.IsNullOrWhiteSpace(request.TrangThai) && Enum.TryParse<TrangThaiNguoiDung>(request.TrangThai, true, out var tt))
        {
            trangThai = tt;
        }

        var items = await _nguoiDungRepository.SearchAsync(request.Keyword, vaiTro, trangThai, request.Page, request.PageSize);
        var totalCount = await _nguoiDungRepository.CountAsync(request.Keyword, vaiTro, trangThai);

        var itemDtos = new List<KhachHangAdminResponseDto>();
        foreach (var item in items)
        {
            var dto = await MapToDtoAsync(item);
            itemDtos.Add(dto);
        }

        return new KhachHangListResponseDto
        {
            Items = itemDtos,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<KhachHangAdminResponseDto> GetByIdAsync(long id)
    {
        var nguoiDung = await _nguoiDungRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        return await MapToDtoAsync(nguoiDung);
    }

    public async Task UpdateStatusAsync(long id, UpdateKhachHangStatusRequestDto request)
    {
        if (!Enum.TryParse<TrangThaiNguoiDung>(request.TrangThai, true, out var trangThai))
        {
            throw new InvalidOperationException("Trạng thái không hợp lệ.");
        }

        var nguoiDung = await _nguoiDungRepository.GetByIdTrackedAsync(id)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        nguoiDung.TrangThai = trangThai;
        nguoiDung.UpdatedAt = DateTime.UtcNow;

        await _nguoiDungRepository.SaveChangesAsync();
    }

    private async Task<KhachHangAdminResponseDto> MapToDtoAsync(Models.Entities.NguoiDung nguoiDung)
    {
        var bookingCount = await _dbContext.Bookings
            .Where(b => b.KhachHangId == nguoiDung.Id)
            .CountAsync();

        var totalSpent = await _dbContext.ThanhToans
            .Where(t => t.Booking!.KhachHangId == nguoiDung.Id && t.TrangThai == TrangThaiGiaoDichThanhToan.thanh_cong)
            .SumAsync(t => t.SoTien);

        var reviewCount = await _dbContext.DanhGias
            .Where(r => r.KhachHangId == nguoiDung.Id)
            .CountAsync();

        var avgRating = await _dbContext.DanhGias
            .Where(r => r.KhachHangId == nguoiDung.Id)
            .Select(r => (double?)r.SoSao)
            .AverageAsync();

        return new KhachHangAdminResponseDto
        {
            Id = nguoiDung.Id,
            Email = nguoiDung.Email,
            HoTen = nguoiDung.HoTen,
            SoDienThoai = nguoiDung.SoDienThoai,
            DiaChi = nguoiDung.DiaChi,
            AnhDaiDien = nguoiDung.AnhDaiDien,
            VaiTro = nguoiDung.VaiTro.ToString(),
            TrangThai = nguoiDung.TrangThai.ToString(),
            CreatedAt = nguoiDung.CreatedAt,
            UpdatedAt = nguoiDung.UpdatedAt,
            TongSoDon = bookingCount,
            TongChiTieu = totalSpent,
            SoDanhGia = reviewCount,
            DanhGiaTrungBinh = avgRating
        };
    }
}