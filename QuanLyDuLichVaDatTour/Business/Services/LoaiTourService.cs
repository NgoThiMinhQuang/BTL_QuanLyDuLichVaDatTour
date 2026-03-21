using BLL.DTOs.LoaiTour;
using BLL.Interfaces;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;

namespace BLL.Services;

public class LoaiTourService : ILoaiTourService
{
    private readonly ILoaiTourRepository _loaiTourRepository;

    public LoaiTourService(ILoaiTourRepository loaiTourRepository)
    {
        _loaiTourRepository = loaiTourRepository;
    }

    public async Task<List<LoaiTourResponseDto>> GetVisibleAsync()
    {
        var loaiTours = await _loaiTourRepository.GetVisibleAsync();
        return loaiTours.Select(MapPublicResponse).ToList();
    }

    public async Task<LoaiTourResponseDto> GetVisibleByIdAsync(ulong id)
    {
        var loaiTour = await _loaiTourRepository.GetVisibleByIdAsync(id)
            ?? throw new KeyNotFoundException("Loại tour không tồn tại.");

        return MapPublicResponse(loaiTour);
    }

    public async Task<List<LoaiTourAdminResponseDto>> GetAllAsync()
    {
        var loaiTours = await _loaiTourRepository.GetAllAsync();
        return loaiTours.Select(MapAdminResponse).ToList();
    }

    public async Task<LoaiTourAdminResponseDto> GetByIdAsync(ulong id)
    {
        var loaiTour = await _loaiTourRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Loại tour không tồn tại.");

        return MapAdminResponse(loaiTour);
    }

    public async Task<LoaiTourAdminResponseDto> CreateAsync(CreateLoaiTourRequestDto request)
    {
        var ten = NormalizeRequiredValue(request.Ten, "Tên loại tour không được để trống.");
        await EnsureTenIsUniqueAsync(ten);

        var now = DateTime.UtcNow;
        var loaiTour = new LoaiTour
        {
            Ten = ten,
            MoTa = NormalizeOptionalValue(request.MoTa),
            TrangThai = request.TrangThai ?? TrangThaiLoaiTour.hoat_dong,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _loaiTourRepository.AddAsync(loaiTour);
        await _loaiTourRepository.SaveChangesAsync();

        return MapAdminResponse(loaiTour);
    }

    public async Task<LoaiTourAdminResponseDto> UpdateAsync(ulong id, UpdateLoaiTourRequestDto request)
    {
        var loaiTour = await _loaiTourRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Loại tour không tồn tại.");

        var ten = NormalizeRequiredValue(request.Ten, "Tên loại tour không được để trống.");
        await EnsureTenIsUniqueAsync(ten, id);

        loaiTour.Ten = ten;
        loaiTour.MoTa = NormalizeOptionalValue(request.MoTa);
        loaiTour.TrangThai = request.TrangThai;
        loaiTour.UpdatedAt = DateTime.UtcNow;

        await _loaiTourRepository.SaveChangesAsync();

        return MapAdminResponse(loaiTour);
    }

    public async Task UpdateStatusAsync(ulong id, UpdateLoaiTourStatusRequestDto request)
    {
        var loaiTour = await _loaiTourRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Loại tour không tồn tại.");

        loaiTour.TrangThai = request.TrangThai;
        loaiTour.UpdatedAt = DateTime.UtcNow;

        await _loaiTourRepository.SaveChangesAsync();
    }

    private async Task EnsureTenIsUniqueAsync(string ten, ulong? currentId = null)
    {
        var existingLoaiTour = await _loaiTourRepository.GetByTenAsync(ten);
        if (existingLoaiTour is not null && existingLoaiTour.Id != currentId)
        {
            throw new InvalidOperationException("Tên loại tour đã tồn tại.");
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

    private static LoaiTourResponseDto MapPublicResponse(LoaiTour loaiTour)
    {
        return new LoaiTourResponseDto
        {
            Id = loaiTour.Id,
            Ten = loaiTour.Ten,
            MoTa = loaiTour.MoTa,
            TrangThai = loaiTour.TrangThai.ToString()
        };
    }

    private static LoaiTourAdminResponseDto MapAdminResponse(LoaiTour loaiTour)
    {
        return new LoaiTourAdminResponseDto
        {
            Id = loaiTour.Id,
            Ten = loaiTour.Ten,
            MoTa = loaiTour.MoTa,
            TrangThai = loaiTour.TrangThai.ToString(),
            CreatedAt = loaiTour.CreatedAt,
            UpdatedAt = loaiTour.UpdatedAt
        };
    }
}
