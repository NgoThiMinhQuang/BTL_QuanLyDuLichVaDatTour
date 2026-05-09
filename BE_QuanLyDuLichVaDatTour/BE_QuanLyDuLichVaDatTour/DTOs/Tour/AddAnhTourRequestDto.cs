namespace BE_QuanLyDuLichVaDatTour.DTOs.Tour;

public class AddAnhTourRequestDto
{
    public string LinkAnh { get; set; } = string.Empty;
    public string? MoTa { get; set; }
}

public class UpdateAnhTourRequestDto
{
    public string? MoTa { get; set; }
}