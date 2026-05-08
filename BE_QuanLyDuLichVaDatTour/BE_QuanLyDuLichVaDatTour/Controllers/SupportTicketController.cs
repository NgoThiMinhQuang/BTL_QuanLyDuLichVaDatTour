using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Route("api/support")]
[Authorize]
public class SupportTicketController : ControllerBase
{
    private readonly ILienHeRepository _lienHeRepo;
    private readonly INguoiDungRepository _nguoiDungRepo;

    public SupportTicketController(ILienHeRepository lienHeRepo, INguoiDungRepository nguoiDungRepo)
    {
        _lienHeRepo = lienHeRepo;
        _nguoiDungRepo = nguoiDungRepo;
    }

    [HttpGet("my-tickets")]
    public async Task<IActionResult> GetMyTickets()
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var user = await _nguoiDungRepo.GetByIdAsync(userId);
        if (user == null)
            return Unauthorized(new { message = "Token không hợp lệ." });

        var tickets = await _lienHeRepo.GetByEmailAsync(user.Email);
        var result = tickets.Select(t => new
        {
            t.Id,
            t.HoTen,
            t.Email,
            t.ChuDe,
            t.NoiDung,
            TrangThai = t.TrangThai.ToString(),
            t.PhanHoi,
            HoTenNguoiXuLy = t.NguoiXuLy?.HoTen,
            t.NgayGui,
            t.NgayXuLy
        });
        return Ok(result);
    }

    [HttpGet("ticket/{id:long}")]
    public async Task<IActionResult> GetTicketDetail(long id)
    {
        if (!User.TryGetCurrentUserId(out var userId))
            return Unauthorized(new { message = "Token không hợp lệ." });

        var user = await _nguoiDungRepo.GetByIdAsync(userId);
        if (user == null)
            return Unauthorized(new { message = "Token không hợp lệ." });

        var ticket = await _lienHeRepo.GetByIdAsync(id);
        if (ticket == null || ticket.Email != user.Email)
            return NotFound(new { message = "Không tìm thấy yêu cầu hỗ trợ." });

        return Ok(new
        {
            ticket.Id,
            ticket.HoTen,
            ticket.Email,
            ticket.ChuDe,
            ticket.NoiDung,
            TrangThai = ticket.TrangThai.ToString(),
            ticket.PhanHoi,
            HoTenNguoiXuLy = ticket.NguoiXuLy?.HoTen,
            ticket.NgayGui,
            ticket.NgayXuLy
        });
    }
}