namespace BE_QuanLyDuLichVaDatTour.DTOs.Booking;

public class HanhKhachResponseDto
{
    public long Id { get; set; }

    public string HoTen { get; set; } = string.Empty;

    public string LoaiKhach { get; set; } = string.Empty;

    public DateTime? NgaySinh { get; set; }

    public string? GioiTinh { get; set; }

    public string? SoGiayTo { get; set; }

    public string? QuocTich { get; set; }

    public string? GhiChu { get; set; }
}
