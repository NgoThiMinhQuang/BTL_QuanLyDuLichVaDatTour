using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Route("api/lich-trinh")]
public class LichTrinhController : ControllerBase
{
    private readonly ILichTrinhService _lichTrinhService;

    public LichTrinhController(ILichTrinhService lichTrinhService)
    {
        _lichTrinhService = lichTrinhService;
    }

    [HttpGet("get-by-tour/{tourId}")]
    public async Task<IActionResult> GetByTourId(long tourId)
    {
        try
        {
            var response = await _lichTrinhService.GetVisibleByTourIdAsync(tourId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
