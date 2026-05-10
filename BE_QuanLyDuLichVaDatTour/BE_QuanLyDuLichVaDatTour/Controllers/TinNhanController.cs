using BE_QuanLyDuLichVaDatTour.DTOs.Chat;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize]
[Route("api/tin-nhan")]
public class TinNhanController : ControllerBase
{
    private readonly ITinNhanService _tinNhanService;

    public TinNhanController(ITinNhanService tinNhanService)
    {
        _tinNhanService = tinNhanService;
    }

    [HttpGet("booking/{bookingId:long}")]
    public async Task<IActionResult> GetByBooking(long bookingId)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            var response = await _tinNhanService.GetTinNhanTheoBookingAsync(bookingId, userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    [HttpGet("general")]
    public async Task<IActionResult> GetGeneralMessages()
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            var response = await _tinNhanService.GetGeneralMessagesAsync(userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("general")]
    public async Task<IActionResult> GuiGeneralMessage([FromBody] GuiGeneralMessageRequest request)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            var response = await _tinNhanService.GuiGeneralMessageAsync(userId, request.NoiDung);
            return StatusCode(StatusCodes.Status201Created, response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> GuiTinNhan([FromBody] GuiTinNhanRequestDto request)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            var response = await _tinNhanService.GuiTinNhanAsync(userId, request);
            return StatusCode(StatusCodes.Status201Created, response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    private bool TryGetCurrentUserId(out long userId)
    {
        return User.TryGetCurrentUserId(out userId);
    }
}
