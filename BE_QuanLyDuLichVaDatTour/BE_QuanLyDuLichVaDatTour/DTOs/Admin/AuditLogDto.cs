namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class NhatKyHeThongDto
{
    public long Id { get; set; }
    public long? NguoiDungId { get; set; }
    public string? HoTenNguoiDung { get; set; }
    public string HanhDong { get; set; } = string.Empty;
    public string Bang { get; set; } = string.Empty;
    public long? BanGhiId { get; set; }
    public string? ChiTiet { get; set; }
    public string? DiaChiIp { get; set; }
    public DateTime ThoiGian { get; set; }
}

public class SearchAuditLogRequestDto
{
    public string? Keyword { get; set; }
    public string? HanhDong { get; set; }
    public string? Bang { get; set; }
    public string? TuNgay { get; set; }
    public string? DenNgay { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class AuditLogListResponseDto
{
    public List<NhatKyHeThongDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}