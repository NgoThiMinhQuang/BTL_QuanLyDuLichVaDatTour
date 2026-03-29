using BE_QuanLyDuLichVaDatTour.DTOs.Tour;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Route("api/tour")]
public class TourController : ControllerBase
{
    private readonly ITourService _tourService;

    public TourController(ITourService tourService)
    {
        _tourService = tourService;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _tourService.GetVisibleAsync();
        return Ok(response);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchTourRequestDto request)
    {
        try
        {
            var response = await _tourService.SearchVisibleAsync(request);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("get-by-id/{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var response = await _tourService.GetVisibleByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
