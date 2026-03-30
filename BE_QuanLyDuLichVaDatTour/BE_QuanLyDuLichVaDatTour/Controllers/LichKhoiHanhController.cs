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

    [HttpGet("{lichKhoiHanhId}/bang-gia")]
    public async Task<IActionResult> GetBangGia(long lichKhoiHanhId)
    {
        try
        {
            var response = await _lichKhoiHanhService.GetBangGiaAsync(lichKhoiHanhId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
