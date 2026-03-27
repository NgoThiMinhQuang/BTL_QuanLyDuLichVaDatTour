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

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _loaiTourService.GetVisibleAsync();
        return Ok(response);
    }

    [HttpGet("get-by-id/{id}")]
    public async Task<IActionResult> GetById(long id)
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
