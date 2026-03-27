using BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/dia-diem")]
public class DiaDiemController : ControllerBase
{
    private readonly IDiaDiemService _diaDiemService;

    public DiaDiemController(IDiaDiemService diaDiemService)
    {
        _diaDiemService = diaDiemService;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _diaDiemService.GetVisibleAsync();
        return Ok(response);
    }

    [HttpGet("get-by-id/{id}")]
    public async Task<IActionResult> GetById(ulong id)
    {
        try
        {
            var response = await _diaDiemService.GetVisibleByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
