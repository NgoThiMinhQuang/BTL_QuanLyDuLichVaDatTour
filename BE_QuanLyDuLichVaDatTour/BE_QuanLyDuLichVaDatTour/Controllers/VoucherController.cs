using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Route("api/voucher")]
[Authorize]
public class VoucherController : ControllerBase
{
    private readonly IVoucherService _voucherService;

    public VoucherController(IVoucherService voucherService)
    {
        _voucherService = voucherService;
    }

    [HttpGet("available")]
    public async Task<IActionResult> GetAvailable()
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var vouchers = await _voucherService.GetAvailableForUserAsync(userId);
        return Ok(vouchers);
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var history = await _voucherService.GetVoucherHistoryAsync(userId);
        return Ok(history);
    }
}