using BLL.DTOs.DiaDiem;

namespace BLL.Interfaces;

public interface IDiaDiemService
{
    Task<List<DiaDiemResponseDto>> GetVisibleAsync();

    Task<DiaDiemResponseDto> GetVisibleByIdAsync(long id);

    Task<List<DiaDiemAdminResponseDto>> GetAllAsync();

    Task<DiaDiemAdminResponseDto> GetByIdAsync(long id);

    Task<DiaDiemAdminResponseDto> CreateAsync(CreateDiaDiemRequestDto request);

    Task<DiaDiemAdminResponseDto> UpdateAsync(long id, UpdateDiaDiemRequestDto request);

    Task UpdateStatusAsync(long id, UpdateDiaDiemStatusRequestDto request);
}
