using BE_QuanLyDuLichVaDatTour.DTOs.Admin;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IAdminDashboardService
{
    Task<AdminDashboardSummaryDto> GetSummaryAsync();
}
