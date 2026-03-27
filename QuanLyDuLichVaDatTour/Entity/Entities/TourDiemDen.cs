namespace Entity.Entities;

public class TourDiemDen
{
    public long Id { get; set; }

    public long TourId { get; set; }

    public long DiaDiemId { get; set; }

    public int ThuTu { get; set; }

    public string? GhiChu { get; set; }

    public DateTime CreatedAt { get; set; }

    public Tour? Tour { get; set; }

    public DiaDiem? DiaDiem { get; set; }
}
