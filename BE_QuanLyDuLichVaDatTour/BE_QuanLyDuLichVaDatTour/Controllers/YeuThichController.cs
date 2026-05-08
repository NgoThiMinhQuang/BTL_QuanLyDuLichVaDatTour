using BE_QuanLyDuLichVaDatTour.DTOs.YeuThich;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Route("api/yeu-thich")]
[Authorize]
public class YeuThichController : ControllerBase
{
    private readonly IYeuThichService _yeuThichService;

    public YeuThichController(IYeuThichService yeuThichService)
    {
        _yeuThichService = yeuThichService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyFavorites()
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var items = await _yeuThichService.GetMyFavoritesAsync(userId);
        return Ok(items);
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] AddYeuThichRequestDto request)
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            var result = await _yeuThichService.AddAsync(userId, request.TourId);
            return CreatedAtAction(nameof(GetMyFavorites), result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("remove/{tourId:long}")]
    public async Task<IActionResult> Remove(long tourId)
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            await _yeuThichService.RemoveAsync(userId, tourId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}