namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class TourDiemDen
{
    public long Id { get; set; }

    public long TourId { get; set; }

    public long DiaDiemId { get; set; }

    public short ThuTu { get; set; }

    public string? GhiChu { get; set; }

    public DateTime CreatedAt { get; set; }

    public Tour? Tour { get; set; }

    public DiaDiem? DiaDiem { get; set; }
}
