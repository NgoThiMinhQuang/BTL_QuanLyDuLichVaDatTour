using BE_QuanLyDuLichVaDatTour.DTOs.Review;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize]
[Route("api/review")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [AllowAnonymous]
    [HttpGet("tour/{tourId:long}")]
    public async Task<IActionResult> GetByTour(long tourId)
    {
        var response = await _reviewService.GetApprovedReviewsByTourAsync(tourId);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpGet("tour/{tourId:long}/summary")]
    public async Task<IActionResult> GetTourSummary(long tourId)
    {
        var response = await _reviewService.GetTourReviewSummaryAsync(tourId);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int limit = 3)
    {
        var response = await _reviewService.GetFeaturedReviewsAsync(limit);
        return Ok(response);
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequestDto request)
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
            var response = await _reviewService.CreateAsync(userId, request);
            return StatusCode(StatusCodes.Status201Created, response);
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

    [HttpGet("my-reviews")]
    public async Task<IActionResult> GetMyReviews()
    {
        if (!TryGetCurrentUserId(out var userId))
        {
            return Unauthorized(new { message = "Token không hợp lệ." });
        }

        try
        {
            var response = await _reviewService.GetMyReviewsAsync(userId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("update/{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateReviewRequestDto request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            var response = await _reviewService.UpdateAsync(userId, id, request);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("delete/{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        if (!TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        try
        {
            await _reviewService.DeleteAsync(userId, id);
            return Ok(new { message = "Đã xóa đánh giá." });
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
