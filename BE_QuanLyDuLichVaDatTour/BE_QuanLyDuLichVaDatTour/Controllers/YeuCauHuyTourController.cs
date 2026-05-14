using BE_QuanLyDuLichVaDatTour.DTOs.Cancellation;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Route("api/huy-tour")]
[Authorize]
public class YeuCauHuyTourController : ControllerBase
{
    private readonly IYeuCauHuyTourService _service;

    public YeuCauHuyTourController(IYeuCauHuyTourService service)
    {
        _service = service;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateCancellationRequestDto request)
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            var result = await _service.CreateAsync(userId, request);
            return CreatedAtAction(nameof(GetByBooking), new { bookingId = result.BookingId }, result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("my-requests")]
    public async Task<IActionResult> GetMyRequests()
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var items = await _service.GetMyCancellationRequestsAsync(userId);
        return Ok(items);
    }

    [HttpGet("by-booking/{bookingId:long}")]
    public async Task<IActionResult> GetByBooking(long bookingId)
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var item = await _service.GetByBookingIdAsync(userId, bookingId);
        if (item == null)
            return NotFound(new { message = "Không tìm thấy yêu cầu hủy." });

        return Ok(item);
    }

    [HttpGet("cancel-status/{bookingId:long}")]
    public async Task<IActionResult> GetCancelStatus(long bookingId)
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var item = await _service.GetStatusByBookingIdAsync(userId, bookingId);
        if (item == null)
            return Ok(new { hasRequest = false, message = "Chưa có yêu cầu hủy nào cho booking này." });

        return Ok(new { hasRequest = true, status = item.TrangThai, reason = item.LyDo, adminNote = item.GhiChuAdmin, createdAt = item.CreatedAt, updatedAt = item.UpdatedAt });
    }
}