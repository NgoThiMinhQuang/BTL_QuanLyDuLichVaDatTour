using BE_QuanLyDuLichVaDatTour.DTOs.LichTrinh;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/lich-trinh")]
public class AdminLichTrinhController : ControllerBase
{
    private readonly ILichTrinhService _lichTrinhService;

    public AdminLichTrinhController(ILichTrinhService lichTrinhService)
    {
        _lichTrinhService = lichTrinhService;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _lichTrinhService.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("get-by-id/{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var response = await _lichTrinhService.GetByIdAsync(id);
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
            var response = await _lichTrinhService.GetByTourIdAsync(tourId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateLichTrinhRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _lichTrinhService.CreateAsync(request);
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
    public async Task<IActionResult> Update(long id, [FromBody] UpdateLichTrinhRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _lichTrinhService.UpdateAsync(id, request);
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

    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(long id)
    {
        try
        {
            await _lichTrinhService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
