namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class AnhTour
{
    public long Id { get; set; }

    public long TourId { get; set; }

    public string LinkAnh { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public bool IsAvatar { get; set; }

    public short ThuTu { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tour? Tour { get; set; }
}
