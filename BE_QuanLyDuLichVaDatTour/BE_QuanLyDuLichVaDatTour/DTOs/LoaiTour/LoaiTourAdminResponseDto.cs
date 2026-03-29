namespace BE_QuanLyDuLichVaDatTour.DTOs.LoaiTour;

public class LoaiTourAdminResponseDto
{
    public long Id { get; set; }

    public string Ten { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public string TrangThai { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
