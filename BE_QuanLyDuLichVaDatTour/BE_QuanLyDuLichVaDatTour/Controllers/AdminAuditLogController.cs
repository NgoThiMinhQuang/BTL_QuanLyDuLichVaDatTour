using BE_QuanLyDuLichVaDatTour.DTOs.Admin;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/audit-log")]
public class AdminAuditLogController : ControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AdminAuditLogController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchAuditLogRequestDto request)
    {
        var response = await _auditLogService.SearchAsync(request);
        return Ok(response);
    }
}