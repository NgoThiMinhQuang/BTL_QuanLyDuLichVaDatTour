using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Voucher;

public class UpdateVoucherStatusRequestDto
{
    [Required]
    public TrangThaiVoucher TrangThai { get; set; }
}
