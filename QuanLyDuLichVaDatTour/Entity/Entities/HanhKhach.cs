using Entity.Enums;

namespace Entity.Entities;

public class HanhKhach
{
    public long Id { get; set; }

    public long BookingId { get; set; }

    public string HoTen { get; set; } = string.Empty;

    public LoaiKhach LoaiKhach { get; set; }

    public DateTime? NgaySinh { get; set; }

    public string? GioiTinh { get; set; }

    public string? SoGiayTo { get; set; }

    public string? QuocTich { get; set; }

    public string? GhiChu { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Booking? Booking { get; set; }
}
