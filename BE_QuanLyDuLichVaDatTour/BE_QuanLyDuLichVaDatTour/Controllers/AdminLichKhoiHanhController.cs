using BE_QuanLyDuLichVaDatTour.DTOs.LichKhoiHanh;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/lich-khoi-hanh")]
public class AdminLichKhoiHanhController : ControllerBase
{
    private readonly ILichKhoiHanhService _lichKhoiHanhService;

    public AdminLichKhoiHanhController(ILichKhoiHanhService lichKhoiHanhService)
    {
        _lichKhoiHanhService = lichKhoiHanhService;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _lichKhoiHanhService.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("get-by-id/{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var response = await _lichKhoiHanhService.GetByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("get-by-tour/{tourId}")]
    public async Task<IActionResult> GetByTourId(long tourId)
    {
        try
        {
            var response = await _lichKhoiHanhService.GetByTourIdAsync(tourId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateLichKhoiHanhRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _lichKhoiHanhService.CreateAsync(request);
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

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateLichKhoiHanhRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _lichKhoiHanhService.UpdateAsync(id, request);
            return Ok(response);
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

    [HttpPatch("update-status/{id}")]
    public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateLichKhoiHanhStatusRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            await _lichKhoiHanhService.UpdateStatusAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
