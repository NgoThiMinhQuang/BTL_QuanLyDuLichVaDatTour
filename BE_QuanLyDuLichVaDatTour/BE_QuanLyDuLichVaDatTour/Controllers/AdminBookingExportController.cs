using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BE_QuanLyDuLichVaDatTour.Controllers;

[ApiController]
[Authorize(Roles = "admin,Admin")]
[Route("api/admin/booking")]
public class AdminBookingExportController : ControllerBase
{
    private readonly IInvoiceExportService _invoiceService;

    public AdminBookingExportController(IInvoiceExportService invoiceService)
    {
        _invoiceService = invoiceService;
    }

    [HttpGet("export-invoice/{id:long}")]
    public async Task<IActionResult> ExportInvoice(long id)
    {
        try
        {
            var pdfBytes = await _invoiceService.ExportInvoicePdfAsync(id);
            return File(pdfBytes, "application/pdf", $"HoaDon_{id}.pdf");
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}