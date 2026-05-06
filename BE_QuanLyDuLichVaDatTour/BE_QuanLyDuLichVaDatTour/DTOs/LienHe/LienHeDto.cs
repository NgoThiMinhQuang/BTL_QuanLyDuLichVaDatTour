namespace BE_QuanLyDuLichVaDatTour.DTOs.LienHe;

public class LienHeAdminResponseDto
{
    public long Id { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string ChuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public string TrangThai { get; set; } = string.Empty;
    public long? NguoiXuLyId { get; set; }
    public string? HoTenNguoiXuLy { get; set; }
    public string? PhanHoi { get; set; }
    public DateTime NgayGui { get; set; }
    public DateTime? NgayXuLy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class UpdateLienHeStatusRequestDto
{
    public string TrangThai { get; set; } = string.Empty;
    public string? PhanHoi { get; set; }
}

public class SearchLienHeRequestDto
{
    public string? Keyword { get; set; }
    public string? TrangThai { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class LienHeListResponseDto
{
    public List<LienHeAdminResponseDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}

public class CreateLienHeRequestDto
{
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string ChuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
}