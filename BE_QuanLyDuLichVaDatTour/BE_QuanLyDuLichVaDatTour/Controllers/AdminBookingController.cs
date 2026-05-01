using BE_QuanLyDuLichVaDatTour.DTOs.Booking;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/booking")]
public class AdminBookingController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public AdminBookingController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _bookingService.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("get-by-id/{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var response = await _bookingService.GetByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("update-status/{id:long}")]
    public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateBookingStatusRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ." });
        }

        try
        {
            await _bookingService.UpdateStatusAsync(userId, id, request);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private bool TryGetCurrentUserId(out long userId)
    {
        return User.TryGetCurrentUserId(out userId);
    }
}
