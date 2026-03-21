using BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/loai-tour")]
public class LoaiTourController : ControllerBase
{
    private readonly ILoaiTourService _loaiTourService;

    public LoaiTourController(ILoaiTourService loaiTourService)
    {
        _loaiTourService = loaiTourService;
    }

    [HttpGet]
    public async Task<IActionResult> GetVisibleLoaiTours()
    {
        var response = await _loaiTourService.GetVisibleAsync();
        return Ok(response);
    }

    [HttpGet("{id:ulong}")]
    public async Task<IActionResult> GetVisibleLoaiTourById(ulong id)
    {
        try
        {
            var response = await _loaiTourService.GetVisibleByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
