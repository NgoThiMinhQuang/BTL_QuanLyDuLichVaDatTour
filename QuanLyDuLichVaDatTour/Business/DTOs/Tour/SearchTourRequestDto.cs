namespace BLL.DTOs.Tour;

public class SearchTourRequestDto
{
    public string? Keyword { get; set; }

    public long? DiemXuatPhatId { get; set; }

    public List<long>? LoaiTourIds { get; set; }

    public List<string>? PhuongTiens { get; set; }

    public decimal? MinPrice { get; set; }

    public decimal? MaxPrice { get; set; }

    public int? MinSoNgay { get; set; }

    public int? MaxSoNgay { get; set; }
}
