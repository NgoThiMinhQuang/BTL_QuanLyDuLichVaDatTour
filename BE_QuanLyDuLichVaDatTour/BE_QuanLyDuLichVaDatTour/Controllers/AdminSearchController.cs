using BE_QuanLyDuLichVaDatTour.DTOs.Admin;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/search")]
public class AdminSearchController : ControllerBase
{
    private readonly IGlobalSearchService _searchService;

    public AdminSearchController(IGlobalSearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] GlobalSearchRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Q) || request.Q.Trim().Length < 2)
        {
            return BadRequest(new { message = "Từ khóa tìm kiếm phải có ít nhất 2 ký tự." });
        }

        var response = await _searchService.SearchAsync(request);
        return Ok(response);
    }
}