using BE_QuanLyDuLichVaDatTour.DTOs.ThongBao;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Route("api/thong-bao")]
[Authorize]
public class ThongBaoController : ControllerBase
{
    private readonly IThongBaoService _service;

    public ThongBaoController(IThongBaoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] int limit = 20, [FromQuery] int offset = 0)
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });
        var items = await _service.GetMyNotificationsAsync(userId, limit, offset);
        return Ok(items);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });
        var count = await _service.GetUnreadCountAsync(userId);
        return Ok(new { count });
    }

    [HttpPatch("mark-read/{id:long}")]
    public async Task<IActionResult> MarkAsRead(long id)
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });
        try
        {
            await _service.MarkAsReadAsync(userId, id);
            return Ok(new { message = "Đã đánh dấu đã đọc." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });
        await _service.MarkAllAsReadAsync(userId);
        return Ok(new { message = "Đã đánh dấu tất cả đã đọc." });
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });
        try
        {
            await _service.DeleteAsync(userId, id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("broadcast")]
    [Authorize(Roles = "admin,Admin")]
    public async Task<IActionResult> Broadcast([FromBody] BroadcastNotificationRequestDto request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var count = await _service.BroadcastAsync(userId, request);
        return Ok(new { message = $"Đã gửi thông báo đến {count} người dùng.", recipientCount = count });
    }
}