using BE_QuanLyDuLichVaDatTour.DTOs.LienHe;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize]
[Route("api/lien-he")]
public class LienHeController : ControllerBase
{
    private readonly ILienHeService _service;

    public LienHeController(ILienHeService service)
    {
        _service = service;
    }

    [HttpPost("create")]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] CreateLienHeRequestDto request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var response = await _service.CreateAsync(request);
            return StatusCode(StatusCodes.Status201Created, new { message = "Đã gửi liên hệ thành công.", id = response.Id });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my-contacts")]
    public async Task<IActionResult> GetMyContacts()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new { message = "Không xác định được email." });

        var items = await _service.GetByEmailAsync(email);
        return Ok(items);
    }
}