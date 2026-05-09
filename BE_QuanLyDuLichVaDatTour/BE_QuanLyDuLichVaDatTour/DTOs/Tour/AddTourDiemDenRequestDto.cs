namespace BE_QuanLyDuLichVaDatTour.DTOs.Tour;

public class AddTourDiemDenRequestDto
{
    public long DiaDiemId { get; set; }
    public string? GhiChu { get; set; }
}

public class UpdateTourDiemDenRequestDto
{
    public string? GhiChu { get; set; }
}