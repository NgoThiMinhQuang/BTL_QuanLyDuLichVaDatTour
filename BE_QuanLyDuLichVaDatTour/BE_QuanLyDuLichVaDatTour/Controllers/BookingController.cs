using BE_QuanLyDuLichVaDatTour.DTOs.Booking;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize]
[Route("api/booking")]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly IInvoiceExportService _invoiceService;

    public BookingController(IBookingService bookingService, IInvoiceExportService invoiceService)
    {
        _bookingService = bookingService;
        _invoiceService = invoiceService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequestDto request)
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
            var response = await _bookingService.CreateAsync(userId, request);
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
        catch (DbUpdateException ex)
        {
            return BadRequest(new { message = $"Lỗi database: {ex.InnerException?.Message ?? ex.Message}" });
        }
    }

    [HttpGet("my-bookings")]
    public async Task<IActionResult> GetMyBookings([FromQuery] string? status, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] string? sortBy, [FromQuery] bool? ascending)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ." });
        }

        try
        {
            var hasFilter = !string.IsNullOrWhiteSpace(status) || fromDate.HasValue || toDate.HasValue || !string.IsNullOrWhiteSpace(sortBy);
            var response = hasFilter
                ? await _bookingService.GetMyBookingsFilteredAsync(userId, status, fromDate, toDate, sortBy, ascending)
                : await _bookingService.GetMyBookingsAsync(userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("get-by-id/{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ." });
        }

        try
        {
            var response = await _bookingService.GetMyBookingByIdAsync(userId, id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("export-invoice/{id:long}")]
    public async Task<IActionResult> ExportInvoice(long id)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            await _bookingService.GetMyBookingByIdAsync(userId, id);
            var pdfBytes = await _invoiceService.ExportInvoicePdfAsync(id);
            return File(pdfBytes, "application/pdf", $"HoaDon_{id}.pdf");
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("export-confirmation/{id:long}")]
    public async Task<IActionResult> ExportConfirmation(long id)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            await _bookingService.GetMyBookingByIdAsync(userId, id);
            var pdfBytes = await _invoiceService.ExportConfirmationPdfAsync(id);
            return File(pdfBytes, "application/pdf", $"XacNhanBooking_{id}.pdf");
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
