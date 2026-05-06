namespace BE_QuanLyDuLichVaDatTour.DTOs.KhachHang;

public class KhachHangListResponseDto
{
    public List<KhachHangAdminResponseDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}