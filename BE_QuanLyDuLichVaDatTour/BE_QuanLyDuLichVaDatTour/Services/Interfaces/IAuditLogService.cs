using BE_QuanLyDuLichVaDatTour.DTOs.Admin;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IAuditLogService
{
    Task LogAsync(long? nguoiDungId, string? hoTenNguoiDung, string hanhDong, string bang, long? banGhiId, string? chiTiet, string? diaChiIp, string? userAgent);
    Task<AuditLogListResponseDto> SearchAsync(SearchAuditLogRequestDto request);
}