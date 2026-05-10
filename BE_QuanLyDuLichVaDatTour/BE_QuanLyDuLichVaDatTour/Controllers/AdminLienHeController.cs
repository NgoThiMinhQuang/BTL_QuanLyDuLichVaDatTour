using BE_QuanLyDuLichVaDatTour.DTOs.LienHe;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/lien-he")]
public class AdminLienHeController : ControllerBase
{
    private readonly ILienHeService _service;

    public AdminLienHeController(ILienHeService service)
    {
        _service = service;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchLienHeRequestDto request)
    {
        var response = await _service.SearchAsync(request);
        return Ok(response);
    }

    [HttpGet("support-tickets")]
    public async Task<IActionResult> GetSupportTickets([FromQuery] SearchLienHeRequestDto request)
    {
        var response = await _service.GetSupportTicketsAsync(request);
        return Ok(response);
    }

    [HttpGet("get-by-id/{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var response = await _service.GetByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("update-status/{id:long}")]
    public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateLienHeStatusRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var adminIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            long? adminId = long.TryParse(adminIdClaim, out var parsed) ? parsed : null;

            await _service.UpdateStatusAsync(id, request, adminId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("create")]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] CreateLienHeRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _service.CreateAsync(request);
            return StatusCode(StatusCodes.Status201Created, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("reply/{id:long}")]
    public async Task<IActionResult> Reply(long id, [FromBody] UpdateLienHeStatusRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.PhanHoi))
            return BadRequest(new { message = "Nội dung phản hồi không được để trống." });

        var adminIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!long.TryParse(adminIdClaim, out var adminId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            await _service.ReplyAsync(id, request.PhanHoi, adminId);
            return Ok(new { message = "Đã gửi phản hồi." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}