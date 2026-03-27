namespace BLL.DTOs.Tour;

public class TourDiemDenResponseDto
{
    public long Id { get; set; }

    public long DiaDiemId { get; set; }

    public string TenDiaDiem { get; set; } = string.Empty;

    public string? TinhThanh { get; set; }

    public string QuocGia { get; set; } = string.Empty;

    public int ThuTu { get; set; }

    public string? GhiChu { get; set; }
}
