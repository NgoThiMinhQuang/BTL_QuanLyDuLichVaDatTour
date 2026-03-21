using BLL.DTOs.DiaDiem;

namespace BLL.Interfaces;

public interface IDiaDiemService
{
    Task<List<DiaDiemAdminResponseDto>> GetAllAsync();

    Task<DiaDiemAdminResponseDto> GetByIdAsync(ulong id);

    Task<DiaDiemAdminResponseDto> CreateAsync(CreateDiaDiemRequestDto request);

    Task<DiaDiemAdminResponseDto> UpdateAsync(ulong id, UpdateDiaDiemRequestDto request);

    Task UpdateStatusAsync(ulong id, UpdateDiaDiemStatusRequestDto request);
}
