using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Voucher;

public class UpdateVoucherStatusRequestDto
{
    [Required]
    public TrangThaiVoucher TrangThai { get; set; }
}
