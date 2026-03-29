namespace BE_QuanLyDuLichVaDatTour.DTOs.Tour;

public class AnhTourResponseDto
{
    public long Id { get; set; }

    public string LinkAnh { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public bool IsAvatar { get; set; }

    public int ThuTu { get; set; }
}
