using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Route("api/lich-khoi-hanh")]
public class LichKhoiHanhController : ControllerBase
{
    private readonly ILichKhoiHanhService _lichKhoiHanhService;

    public LichKhoiHanhController(ILichKhoiHanhService lichKhoiHanhService)
    {
        _lichKhoiHanhService = lichKhoiHanhService;
    }

    [HttpGet("get-by-tour/{tourId}")]
    public async Task<IActionResult> GetByTourId(long tourId)
    {
        try
        {
            var response = await _lichKhoiHanhService.GetVisibleByTourIdAsync(tourId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
