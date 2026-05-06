using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.KhachHang;

public class SearchKhachHangRequestDto
{
    public string? Keyword { get; set; }

    public string? VaiTro { get; set; }

    public string? TrangThai { get; set; }

    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(5, 50)]
    public int PageSize { get; set; } = 10;
}