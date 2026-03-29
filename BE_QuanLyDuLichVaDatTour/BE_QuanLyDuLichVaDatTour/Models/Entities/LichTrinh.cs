namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class LichTrinh
{
    public long Id { get; set; }

    public long TourId { get; set; }

    public byte NgayThu { get; set; }

    public short ThuTuTrongNgay { get; set; }

    public TimeSpan? GioBatDau { get; set; }

    public TimeSpan? GioKetThuc { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public long? DiaDiemId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tour? Tour { get; set; }

    public DiaDiem? DiaDiem { get; set; }
}
