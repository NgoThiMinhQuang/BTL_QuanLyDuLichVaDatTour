using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class GlobalSearchRequestDto
{
    [Required]
    [MinLength(2)]
    public string Q { get; set; } = string.Empty;

    public List<string>? Modules { get; set; }
}

public class GlobalSearchResultDto
{
    public string Module { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Status { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? Icon { get; set; }
}

public class GlobalSearchResponseDto
{
    public List<GlobalSearchResultDto> Tours { get; set; } = new();
    public List<GlobalSearchResultDto> Bookings { get; set; } = new();
    public List<GlobalSearchResultDto> Customers { get; set; } = new();
    public List<GlobalSearchResultDto> Vouchers { get; set; } = new();
    public List<GlobalSearchResultDto> LichKhoiHanhs { get; set; } = new();
    public List<GlobalSearchResultDto> TinTucs { get; set; } = new();
    public int TotalCount { get; set; }
}