using BE_QuanLyDuLichVaDatTour.DTOs.Cancellation;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Route("api/admin/huy-tour")]
[Authorize(Roles = "admin,Admin")]
public class AdminYeuCauHuyTourController : ControllerBase
{
    private readonly IYeuCauHuyTourService _service;

    public AdminYeuCauHuyTourController(IYeuCauHuyTourService service)
    {
        _service = service;
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var items = await _service.GetPendingAsync();
        return Ok(items);
    }

    [HttpGet("get-by-id/{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var item = await _service.GetByIdAsync(id);
            return Ok(item);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("update-status/{id:long}")]
    public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateCancellationRequestDto request)
    {
        if (!User.TryGetCurrentUserId(out var adminUserId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            await _service.UpdateStatusAsync(adminUserId, id, request);
            return Ok(new { message = "Cập nhật trạng thái thành công." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}