using BE_QuanLyDuLichVaDatTour.DTOs.Payment;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/payment")]
public class AdminPaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public AdminPaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _paymentService.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("get-by-id/{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var response = await _paymentService.GetAdminByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("update-status/{id:long}")]
    public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdatePaymentStatusRequestDto request)
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
            await _paymentService.UpdateStatusAsync(userId, id, request);
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
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return long.TryParse(userIdClaim, out userId);
    }
}
