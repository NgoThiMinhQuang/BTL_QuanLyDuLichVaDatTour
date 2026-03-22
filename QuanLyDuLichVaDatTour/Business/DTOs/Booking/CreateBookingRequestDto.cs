using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Booking;

public class CreateBookingRequestDto
{
    [Required]
    public ulong LichKhoiHanhId { get; set; }

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
    [Range(1, ushort.MaxValue)]
    public ushort SoNguoiLon { get; set; }

    [Range(0, ushort.MaxValue)]
    public ushort SoTreEm { get; set; }

    [Range(0, ushort.MaxValue)]
    public ushort SoEmBe { get; set; }

    public PhuongThucThanhToan? PhuongThucThanhToanDuKien { get; set; }

    public string? GhiChu { get; set; }
}
