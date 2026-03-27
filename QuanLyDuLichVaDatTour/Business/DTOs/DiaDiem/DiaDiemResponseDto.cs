namespace BLL.DTOs.DiaDiem;

public class DiaDiemResponseDto
{
    public long Id { get; set; }

    public string TenDiaDiem { get; set; } = string.Empty;

    public string? TinhThanh { get; set; }

    public string QuocGia { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public string TrangThai { get; set; } = string.Empty;
}
