using BLL.DTOs.DiaDiem;
using BLL.Interfaces;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;

namespace BLL.Services;

public class DiaDiemService : IDiaDiemService
{
    private readonly IDiaDiemRepository _diaDiemRepository;

    public DiaDiemService(IDiaDiemRepository diaDiemRepository)
    {
        _diaDiemRepository = diaDiemRepository;
    }

    public async Task<List<DiaDiemResponseDto>> GetVisibleAsync()
    {
        var diaDiems = await _diaDiemRepository.GetVisibleAsync();
        return diaDiems.Select(MapPublicResponse).ToList();
    }

    public async Task<DiaDiemResponseDto> GetVisibleByIdAsync(long id)
    {
        var diaDiem = await _diaDiemRepository.GetVisibleByIdAsync(id)
            ?? throw new KeyNotFoundException("Địa điểm không tồn tại.");

        return MapPublicResponse(diaDiem);
    }

    public async Task<List<DiaDiemAdminResponseDto>> GetAllAsync()
    {
        var diaDiems = await _diaDiemRepository.GetAllAsync();
        return diaDiems.Select(MapAdminResponse).ToList();
    }

    public async Task<DiaDiemAdminResponseDto> GetByIdAsync(long id)
    {
        var diaDiem = await _diaDiemRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Địa điểm không tồn tại.");

        return MapAdminResponse(diaDiem);
    }

    public async Task<DiaDiemAdminResponseDto> CreateAsync(CreateDiaDiemRequestDto request)
    {
        var tenDiaDiem = NormalizeRequiredValue(request.TenDiaDiem, "Tên địa điểm không được để trống.");
        var tinhThanh = NormalizeOptionalValue(request.TinhThanh);
        var quocGia = NormalizeCountry(request.QuocGia);

        await EnsureDiaDiemIsUniqueAsync(tenDiaDiem, tinhThanh, quocGia);

        var now = DateTime.UtcNow;
        var diaDiem = new DiaDiem
        {
            TenDiaDiem = tenDiaDiem,
            TinhThanh = tinhThanh,
            QuocGia = quocGia,
            MoTa = NormalizeOptionalValue(request.MoTa),
            TrangThai = request.TrangThai ?? TrangThaiDiaDiem.hoat_dong,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _diaDiemRepository.AddAsync(diaDiem);
        await _diaDiemRepository.SaveChangesAsync();

        return MapAdminResponse(diaDiem);
    }

    public async Task<DiaDiemAdminResponseDto> UpdateAsync(long id, UpdateDiaDiemRequestDto request)
    {
        var diaDiem = await _diaDiemRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Địa điểm không tồn tại.");

        var tenDiaDiem = NormalizeRequiredValue(request.TenDiaDiem, "Tên địa điểm không được để trống.");
        var tinhThanh = NormalizeOptionalValue(request.TinhThanh);
        var quocGia = NormalizeCountry(request.QuocGia);

        await EnsureDiaDiemIsUniqueAsync(tenDiaDiem, tinhThanh, quocGia, id);

        diaDiem.TenDiaDiem = tenDiaDiem;
        diaDiem.TinhThanh = tinhThanh;
        diaDiem.QuocGia = quocGia;
        diaDiem.MoTa = NormalizeOptionalValue(request.MoTa);
        diaDiem.TrangThai = request.TrangThai;
        diaDiem.UpdatedAt = DateTime.UtcNow;

        await _diaDiemRepository.SaveChangesAsync();

        return MapAdminResponse(diaDiem);
    }

    public async Task UpdateStatusAsync(long id, UpdateDiaDiemStatusRequestDto request)
    {
        var diaDiem = await _diaDiemRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Địa điểm không tồn tại.");

        diaDiem.TrangThai = request.TrangThai;
        diaDiem.UpdatedAt = DateTime.UtcNow;

        await _diaDiemRepository.SaveChangesAsync();
    }

    private async Task EnsureDiaDiemIsUniqueAsync(string tenDiaDiem, string? tinhThanh, string quocGia, long? currentId = null)
    {
        var existingDiaDiem = await _diaDiemRepository.GetByTenTinhThanhQuocGiaAsync(tenDiaDiem, tinhThanh, quocGia);
        if (existingDiaDiem is not null && existingDiaDiem.Id != currentId)
        {
            throw new InvalidOperationException("Địa điểm đã tồn tại.");
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

    private static string NormalizeCountry(string? country)
    {
        if (string.IsNullOrWhiteSpace(country))
        {
            return "Viet Nam";
        }

        return country.Trim();
    }

    private static DiaDiemResponseDto MapPublicResponse(DiaDiem diaDiem)
    {
        return new DiaDiemResponseDto
        {
            Id = diaDiem.Id,
            TenDiaDiem = diaDiem.TenDiaDiem,
            TinhThanh = diaDiem.TinhThanh,
            QuocGia = diaDiem.QuocGia,
            MoTa = diaDiem.MoTa,
            TrangThai = diaDiem.TrangThai.ToString()
        };
    }

    private static DiaDiemAdminResponseDto MapAdminResponse(DiaDiem diaDiem)
    {
        return new DiaDiemAdminResponseDto
        {
            Id = diaDiem.Id,
            TenDiaDiem = diaDiem.TenDiaDiem,
            TinhThanh = diaDiem.TinhThanh,
            QuocGia = diaDiem.QuocGia,
            MoTa = diaDiem.MoTa,
            TrangThai = diaDiem.TrangThai.ToString(),
            CreatedAt = diaDiem.CreatedAt,
            UpdatedAt = diaDiem.UpdatedAt
        };
    }
}
