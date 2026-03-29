using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.LichTrinh;

public class UpdateLichTrinhRequestDto
{
    [Required]
    public long TourId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int NgayThu { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int ThuTuTrongNgay { get; set; }

    public TimeSpan? GioBatDau { get; set; }

    public TimeSpan? GioKetThuc { get; set; }

    [MaxLength(300)]
    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public long? DiaDiemId { get; set; }
}
