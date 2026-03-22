namespace Entity.Entities;

public class LichTrinh
{
    public ulong Id { get; set; }

    public ulong TourId { get; set; }

    public byte NgayThu { get; set; }

    public ushort ThuTuTrongNgay { get; set; }

    public TimeSpan? GioBatDau { get; set; }

    public TimeSpan? GioKetThuc { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public ulong? DiaDiemId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tour? Tour { get; set; }

    public DiaDiem? DiaDiem { get; set; }
}
