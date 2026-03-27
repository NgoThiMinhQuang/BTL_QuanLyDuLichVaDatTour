using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Booking;

public class CreateBookingRequestDto
{
    [Required]
    public long LichKhoiHanhId { get; set; }

    [MaxLength(200)]
    public string? HoTenLienHe { get; set; }

    [EmailAddress]
    [MaxLength(255)]
    public string? EmailLienHe { get; set; }

    [MaxLength(20)]
    public string? SoDienThoaiLienHe { get; set; }

    [MaxLength(300)]
    public string? DiaChiLienHe { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int SoNguoiLon { get; set; }

    [Range(0, int.MaxValue)]
    public int SoTreEm { get; set; }

    [Range(0, int.MaxValue)]
    public int SoEmBe { get; set; }

    public PhuongThucThanhToan? PhuongThucThanhToanDuKien { get; set; }

    public string? GhiChu { get; set; }
}
