using BE_QuanLyDuLichVaDatTour.DTOs.Payment;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize]
[Route("api/payment")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreatePaymentRequestDto request)
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
            var response = await _paymentService.CreateAsync(userId, request);
            return StatusCode(StatusCodes.Status201Created, response);
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

    [HttpGet("booking/{bookingId:long}")]
    public async Task<IActionResult> GetByBookingId(long bookingId)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ." });
        }

        try
        {
            var response = await _paymentService.GetByBookingIdAsync(userId, bookingId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ." });
        }

        try
        {
            var response = await _paymentService.GetByIdAsync(userId, id);
            return Ok(response);
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
