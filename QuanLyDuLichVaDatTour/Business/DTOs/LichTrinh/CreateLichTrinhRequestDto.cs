using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.LichTrinh;

public class CreateLichTrinhRequestDto
{
    [Required]
    public ulong TourId { get; set; }

    [Required]
    [Range(1, byte.MaxValue)]
    public byte NgayThu { get; set; }

    [Required]
    [Range(1, ushort.MaxValue)]
    public ushort ThuTuTrongNgay { get; set; }

    public TimeSpan? GioBatDau { get; set; }

    public TimeSpan? GioKetThuc { get; set; }

    [MaxLength(300)]
    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public ulong? DiaDiemId { get; set; }
}
