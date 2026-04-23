namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class AdminTopTourDto
{
    public long TourId { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public int SoBooking { get; set; }

    public decimal DoanhThu { get; set; }
}
