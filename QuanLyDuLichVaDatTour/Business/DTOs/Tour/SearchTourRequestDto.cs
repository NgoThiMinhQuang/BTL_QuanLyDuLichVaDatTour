namespace BLL.DTOs.Tour;

public class SearchTourRequestDto
{
    public string? Keyword { get; set; }

    public ulong? DiemXuatPhatId { get; set; }

    public List<ulong>? LoaiTourIds { get; set; }

    public List<string>? PhuongTiens { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    public byte? MinSoNgay { get; set; }

    public byte? MaxSoNgay { get; set; }
}
