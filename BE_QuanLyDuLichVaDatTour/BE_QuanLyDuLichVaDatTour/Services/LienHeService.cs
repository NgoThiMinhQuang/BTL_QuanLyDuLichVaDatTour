using BE_QuanLyDuLichVaDatTour.DTOs.LienHe;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class LienHeService : ILienHeService
{
    private readonly ILienHeRepository _repository;

    public LienHeService(ILienHeRepository repository)
    {
        _repository = repository;
    }

    public async Task<LienHeListResponseDto> SearchAsync(SearchLienHeRequestDto request)
    {
        TrangThaiLienHe? trangThai = null;
        if (!string.IsNullOrWhiteSpace(request.TrangThai) && Enum.TryParse<TrangThaiLienHe>(request.TrangThai, true, out var tt))
        {
            trangThai = tt;
        }

        var items = await _repository.SearchAsync(request.Keyword, trangThai, request.Page, request.PageSize);
        var totalCount = await _repository.CountAsync(request.Keyword, trangThai);

        return new LienHeListResponseDto
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<LienHeAdminResponseDto> GetByIdAsync(long id)
    {
        var item = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Liên hệ không tồn tại.");
        return MapToDto(item);
    }

    public async Task UpdateStatusAsync(long id, UpdateLienHeStatusRequestDto request, long? adminId)
    {
        if (!Enum.TryParse<TrangThaiLienHe>(request.TrangThai, true, out var trangThai))
        {
            throw new InvalidOperationException("Trạng thái không hợp lệ.");
        }

        var item = await _repository.GetByIdTrackedAsync(id)
            ?? throw new KeyNotFoundException("Liên hệ không tồn tại.");

        item.TrangThai = trangThai;
        item.PhanHoi = request.PhanHoi;
        item.NguoiXuLyId = adminId;

        if (trangThai == TrangThaiLienHe.da_xu_ly || trangThai == TrangThaiLienHe.bo_qua)
        {
            item.NgayXuLy = DateTime.UtcNow;
        }

        item.UpdatedAt = DateTime.UtcNow;

        await _repository.SaveChangesAsync();
    }

    public async Task ReplyAsync(long id, string phanHoi, long adminId)
    {
        if (string.IsNullOrWhiteSpace(phanHoi))
            throw new InvalidOperationException("Nội dung phản hồi không được để trống.");

        var item = await _repository.GetByIdTrackedAsync(id)
            ?? throw new KeyNotFoundException("Liên hệ không tồn tại.");

        item.PhanHoi = phanHoi.Trim();
        item.NguoiXuLyId = adminId;
        item.TrangThai = TrangThaiLienHe.da_xu_ly;
        item.NgayXuLy = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;

        await _repository.SaveChangesAsync();
    }

    public async Task<List<UserLienHeResponseDto>> GetByEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return new List<UserLienHeResponseDto>();

        var items = await _repository.SearchAsync(null, null, 1, 100);
        return items
            .Where(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
            .Select(x => new UserLienHeResponseDto
            {
                Id = x.Id,
                ChuDe = x.ChuDe,
                NoiDung = x.NoiDung,
                TrangThai = x.TrangThai.ToString(),
                PhanHoi = x.PhanHoi,
                NgayGui = x.NgayGui,
                NgayXuLy = x.NgayXuLy
            })
            .OrderByDescending(x => x.NgayGui)
            .ToList();
    }

    public async Task<LienHeAdminResponseDto> CreateAsync(CreateLienHeRequestDto request)
    {
        var now = DateTime.UtcNow;
        var item = new LienHe
        {
            HoTen = request.HoTen.Trim(),
            Email = request.Email.Trim(),
            SoDienThoai = string.IsNullOrWhiteSpace(request.SoDienThoai) ? null : request.SoDienThoai.Trim(),
            ChuDe = request.ChuDe.Trim(),
            NoiDung = request.NoiDung.Trim(),
            TrangThai = TrangThaiLienHe.moi,
            NgayGui = now,
            CreatedAt = now,
            UpdatedAt = now,
        };

        await _repository.AddAsync(item);
        await _repository.SaveChangesAsync();

        return MapToDto(item);
    }

    private static LienHeAdminResponseDto MapToDto(LienHe item)
    {
        return new LienHeAdminResponseDto
        {
            Id = item.Id,
            HoTen = item.HoTen,
            Email = item.Email,
            SoDienThoai = item.SoDienThoai,
            ChuDe = item.ChuDe,
            NoiDung = item.NoiDung,
            TrangThai = item.TrangThai.ToString(),
            NguoiXuLyId = item.NguoiXuLyId,
            HoTenNguoiXuLy = item.NguoiXuLy?.HoTen,
            PhanHoi = item.PhanHoi,
            NgayGui = item.NgayGui,
            NgayXuLy = item.NgayXuLy,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt,
        };
    }
}