using BLL.DTOs.Voucher;
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Authorize(Roles = "admin")]
[Route("api/admin/voucher")]
public class AdminVoucherController : ControllerBase
{
    private readonly IVoucherService _voucherService;

    public AdminVoucherController(IVoucherService voucherService)
    {
        _voucherService = voucherService;
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAll()
    {
        var response = await _voucherService.GetAllAsync();
        return Ok(response);
    }

    [HttpGet("get-by-id/{id}")]
    public async Task<IActionResult> GetById(long id)
    {
        try
        {
            var response = await _voucherService.GetByIdAsync(id);
            return Ok(response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] CreateVoucherRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _voucherService.CreateAsync(request);
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
    public async Task<IActionResult> Update(long id, [FromBody] UpdateVoucherRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var response = await _voucherService.UpdateAsync(id, request);
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
    public async Task<IActionResult> UpdateStatus(long id, [FromBody] UpdateVoucherStatusRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            await _voucherService.UpdateStatusAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
