using BE_QuanLyDuLichVaDatTour.DTOs.Review;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/review")]
public class AdminReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public AdminReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending([FromQuery] int limit = 5)
    {
        var response = await _reviewService.GetPendingReviewsAsync(limit <= 0 ? 5 : limit);
        return Ok(response);
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _reviewService.GetAllAdminReviewsAsync();
        return Ok(response);
    }

    [HttpPatch("update-status/{id:long}")]
    public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateAdminReviewStatusRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ." });
        }

        try
        {
            await _reviewService.UpdateAdminStatusAsync(userId, id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("approve/{id:long}")]
    public async Task<IActionResult> Approve(long id, [FromBody] UpdateAdminReviewStatusRequestDto? request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ." });
        }

        try
        {
            await _reviewService.ApproveAsync(userId, id, request?.PhanHoiAdmin);
            return Ok(new { message = "Đã duyệt đánh giá." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("hide/{id:long}")]
    public async Task<IActionResult> Hide(long id, [FromBody] UpdateAdminReviewStatusRequestDto? request)
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ." });
        }

        try
        {
            await _reviewService.HideAsync(userId, id, request?.PhanHoiAdmin);
            return Ok(new { message = "Đã ẩn đánh giá." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    private bool TryGetCurrentUserId(out long userId)
    {
        return User.TryGetCurrentUserId(out userId);
    }
}
