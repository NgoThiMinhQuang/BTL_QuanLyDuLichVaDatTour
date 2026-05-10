using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface ISeatHoldRepository
{
    Task AddAsync(SeatHold hold);
    Task<SeatHold?> GetByTokenAsync(string token);
    Task<SeatHold?> GetActiveHoldAsync(long lichKhoiHanhId, long khachHangId);
    Task<SeatHold?> GetTrackedByTokenAsync(string token);
    Task<int> GetHeldSeatsAsync(long lichKhoiHanhId);
    Task<int> SaveChangesAsync();
}