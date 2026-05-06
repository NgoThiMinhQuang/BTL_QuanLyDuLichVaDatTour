using BE_QuanLyDuLichVaDatTour.DTOs.LienHe;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface ILienHeService
{
    Task<LienHeListResponseDto> SearchAsync(SearchLienHeRequestDto request);
    Task<LienHeAdminResponseDto> GetByIdAsync(long id);
    Task UpdateStatusAsync(long id, UpdateLienHeStatusRequestDto request, long? adminId);
    Task<LienHeAdminResponseDto> CreateAsync(CreateLienHeRequestDto request);
}