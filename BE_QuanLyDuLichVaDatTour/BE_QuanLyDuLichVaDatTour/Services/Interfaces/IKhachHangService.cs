using BE_QuanLyDuLichVaDatTour.DTOs.KhachHang;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IKhachHangService
{
    Task<KhachHangListResponseDto> SearchAsync(SearchKhachHangRequestDto request);
    Task<KhachHangAdminResponseDto> GetByIdAsync(long id);
    Task UpdateStatusAsync(long id, UpdateKhachHangStatusRequestDto request);
}