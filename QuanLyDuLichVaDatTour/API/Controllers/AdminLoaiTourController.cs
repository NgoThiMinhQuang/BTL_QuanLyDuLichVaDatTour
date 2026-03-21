using BLL.DTOs.LoaiTour;
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Authorize(Roles = "admin")]
[Route("api/admin/loai-tour")]
public class AdminLoaiTourController : ControllerBase
{
    private readonly ILoaiTourService _loaiTourService;

    public AdminLoaiTourController(ILoaiTourService loaiTourService)
    {
        _loaiTourService = loaiTourService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllLoaiTours()
    {
        var response = await _loaiTourService.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("{id:ulong}")]
    public async Task<IActionResult> GetLoaiTourById(ulong id)
    {
        try
        {
            var response = await _loaiTourService.GetByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateLoaiTour([FromBody] CreateLoaiTourRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _loaiTourService.CreateAsync(request);
            return StatusCode(StatusCodes.Status201Created, response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:ulong}")]
    public async Task<IActionResult> UpdateLoaiTour(ulong id, [FromBody] UpdateLoaiTourRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _loaiTourService.UpdateAsync(id, request);
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

    [HttpPatch("{id:ulong}/trang-thai")]
    public async Task<IActionResult> UpdateLoaiTourStatus(ulong id, [FromBody] UpdateLoaiTourStatusRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            await _loaiTourService.UpdateStatusAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
