using BE_QuanLyDuLichVaDatTour.DTOs.TinTuc;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class TinTucService : ITinTucService
{
    private readonly ITinTucRepository _tinTucRepository;

    public TinTucService(ITinTucRepository tinTucRepository)
    {
        _tinTucRepository = tinTucRepository;
    }

    public async Task<List<TinTucResponseDto>> GetVisibleAsync()
    {
        var tinTucs = await _tinTucRepository.GetVisibleAsync();
        return tinTucs.Select(MapPublicResponse).ToList();
    }

    public async Task<TinTucResponseDto> GetVisibleByIdAsync(long id)
    {
        var tinTuc = await _tinTucRepository.GetVisibleByIdAsync(id)
            ?? throw new KeyNotFoundException("Tin tức không tồn tại.");

        return MapPublicResponse(tinTuc);
    }

    public async Task<List<TinTucAdminResponseDto>> GetAllAsync()
    {
        var tinTucs = await _tinTucRepository.GetAllAsync();
        return tinTucs.Select(MapAdminResponse).ToList();
    }

    public async Task<TinTucAdminResponseDto> GetByIdAsync(long id)
    {
        var tinTuc = await _tinTucRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Tin tức không tồn tại.");

        return MapAdminResponse(tinTuc);
    }

    public async Task<TinTucAdminResponseDto> CreateAsync(CreateTinTucRequestDto request)
    {
        var tieuDe = NormalizeRequiredValue(request.TieuDe, "Tiêu đề không được để trống.");
        var slug = NormalizeRequiredValue(request.Slug, "Slug không được để trống.");
        var noiDung = NormalizeRequiredValue(request.NoiDung, "Nội dung không được để trống.");

        await EnsureSlugIsUniqueAsync(slug);

        var now = DateTime.UtcNow;
        var tinTuc = new TinTuc
        {
            TieuDe = tieuDe,
            Slug = slug,
            TomTat = NormalizeOptionalValue(request.TomTat),
            NoiDung = noiDung,
            AnhDaiDien = NormalizeOptionalValue(request.AnhDaiDien),
            DanhMuc = NormalizeOptionalValue(request.DanhMuc),
            NgayDang = request.NgayDang ?? now,
            TrangThai = request.TrangThai ?? TrangThaiTinTuc.hoat_dong,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _tinTucRepository.AddAsync(tinTuc);
        await _tinTucRepository.SaveChangesAsync();

        return MapAdminResponse(tinTuc);
    }

    public async Task<TinTucAdminResponseDto> UpdateAsync(long id, UpdateTinTucRequestDto request)
    {
        var tinTuc = await _tinTucRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Tin tức không tồn tại.");

        var tieuDe = NormalizeRequiredValue(request.TieuDe, "Tiêu đề không được để trống.");
        var slug = NormalizeRequiredValue(request.Slug, "Slug không được để trống.");
        var noiDung = NormalizeRequiredValue(request.NoiDung, "Nội dung không được để trống.");

        await EnsureSlugIsUniqueAsync(slug, id);

        tinTuc.TieuDe = tieuDe;
        tinTuc.Slug = slug;
        tinTuc.TomTat = NormalizeOptionalValue(request.TomTat);
        tinTuc.NoiDung = noiDung;
        tinTuc.AnhDaiDien = NormalizeOptionalValue(request.AnhDaiDien);
        tinTuc.DanhMuc = NormalizeOptionalValue(request.DanhMuc);
        tinTuc.NgayDang = request.NgayDang;
        tinTuc.TrangThai = request.TrangThai;
        tinTuc.UpdatedAt = DateTime.UtcNow;

        await _tinTucRepository.SaveChangesAsync();

        return MapAdminResponse(tinTuc);
    }

    public async Task UpdateStatusAsync(long id, UpdateTinTucStatusRequestDto request)
    {
        var tinTuc = await _tinTucRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Tin tức không tồn tại.");

        tinTuc.TrangThai = request.TrangThai;
        tinTuc.UpdatedAt = DateTime.UtcNow;

        await _tinTucRepository.SaveChangesAsync();
    }

    private async Task EnsureSlugIsUniqueAsync(string slug, long? currentId = null)
    {
        var existingTinTuc = await _tinTucRepository.GetBySlugAsync(slug);
        if (existingTinTuc is not null && existingTinTuc.Id != currentId)
        {
            throw new InvalidOperationException("Slug tin tức đã tồn tại.");
        }
    }

    private static string NormalizeRequiredValue(string value, string errorMessage)
    {
        var normalizedValue = value.Trim();
        if (string.IsNullOrWhiteSpace(normalizedValue))
        {
            throw new InvalidOperationException(errorMessage);
        }

        return normalizedValue;
    }

    private static string? NormalizeOptionalValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    private static TinTucResponseDto MapPublicResponse(TinTuc tinTuc)
    {
        return new TinTucResponseDto
        {
            Id = tinTuc.Id,
            TieuDe = tinTuc.TieuDe,
            Slug = tinTuc.Slug,
            TomTat = tinTuc.TomTat,
            NoiDung = tinTuc.NoiDung,
            AnhDaiDien = tinTuc.AnhDaiDien,
            DanhMuc = tinTuc.DanhMuc,
            NgayDang = tinTuc.NgayDang,
            TrangThai = tinTuc.TrangThai.ToString()
        };
    }

    private static TinTucAdminResponseDto MapAdminResponse(TinTuc tinTuc)
    {
        return new TinTucAdminResponseDto
        {
            Id = tinTuc.Id,
            TieuDe = tinTuc.TieuDe,
            Slug = tinTuc.Slug,
            TomTat = tinTuc.TomTat,
            NoiDung = tinTuc.NoiDung,
            AnhDaiDien = tinTuc.AnhDaiDien,
            DanhMuc = tinTuc.DanhMuc,
            NgayDang = tinTuc.NgayDang,
            TrangThai = tinTuc.TrangThai.ToString(),
            CreatedAt = tinTuc.CreatedAt,
            UpdatedAt = tinTuc.UpdatedAt
        };
    }
}
