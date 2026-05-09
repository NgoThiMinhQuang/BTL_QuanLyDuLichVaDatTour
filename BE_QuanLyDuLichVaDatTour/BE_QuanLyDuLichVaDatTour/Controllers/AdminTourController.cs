using BE_QuanLyDuLichVaDatTour.DTOs.Tour;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/tour")]
public class AdminTourController : ControllerBase
{
    private readonly ITourService _tourService;

    public AdminTourController(ITourService tourService)
    {
        _tourService = tourService;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _tourService.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("get-by-id/{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var response = await _tourService.GetByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateTourRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _tourService.CreateAsync(request);
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

    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateTourRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _tourService.UpdateAsync(id, request);
            return Ok(response);
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

    [HttpPatch("update-status/{id}")]
    public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateTourStatusRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            await _tourService.UpdateStatusAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPatch("hide/{id}")]
    public async Task<IActionResult> Hide(long id)
    {
        try
        {
            await _tourService.HideAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ── TourDiemDen ──

    [HttpPost("{tourId:long}/diem-den")]
    public async Task<IActionResult> AddDiemDen(long tourId, [FromBody] AddTourDiemDenRequestDto request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var response = await _tourService.AddDiemDenAsync(tourId, request);
            return StatusCode(StatusCodes.Status201Created, response);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpDelete("diem-den/{tourDiemDenId:long}")]
    public async Task<IActionResult> DeleteDiemDen(long tourDiemDenId)
    {
        try
        {
            await _tourService.DeleteDiemDenAsync(tourDiemDenId);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut("diem-den/{tourDiemDenId:long}")]
    public async Task<IActionResult> UpdateDiemDen(long tourDiemDenId, [FromBody] UpdateTourDiemDenRequestDto request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var response = await _tourService.UpdateDiemDenAsync(tourDiemDenId, request);
            return Ok(response);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut("{tourId:long}/diem-den/reorder")]
    public async Task<IActionResult> ReorderDiemDens(long tourId, [FromBody] List<long> diemDenIds)
    {
        try
        {
            var response = await _tourService.ReorderDiemDensAsync(tourId, diemDenIds);
            return Ok(response);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    // ── AnhTour ──

    [HttpPost("{tourId:long}/anh")]
    public async Task<IActionResult> AddAnhTour(long tourId, [FromBody] AddAnhTourRequestDto request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var response = await _tourService.AddAnhTourAsync(tourId, request);
            return StatusCode(StatusCodes.Status201Created, response);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpDelete("anh/{anhTourId:long}")]
    public async Task<IActionResult> DeleteAnhTour(long anhTourId)
    {
        try
        {
            await _tourService.DeleteAnhTourAsync(anhTourId);
            return NoContent();
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut("anh/{anhTourId:long}")]
    public async Task<IActionResult> UpdateAnhTour(long anhTourId, [FromBody] UpdateAnhTourRequestDto request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var response = await _tourService.UpdateAnhTourAsync(anhTourId, request);
            return Ok(response);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPatch("anh/{anhTourId:long}/set-avatar")]
    public async Task<IActionResult> SetAvatar(long anhTourId)
    {
        try
        {
            var response = await _tourService.SetAvatarAsync(anhTourId);
            return Ok(response);
        }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }

    [HttpPut("{tourId:long}/anh/reorder")]
    public async Task<IActionResult> ReorderAnhTours(long tourId, [FromBody] List<long> anhTourIds)
    {
        try
        {
            var response = await _tourService.ReorderAnhToursAsync(tourId, anhTourIds);
            return Ok(response);
        }
        catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
    }
}
