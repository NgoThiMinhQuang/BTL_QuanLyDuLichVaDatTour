namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IInvoiceExportService
{
    Task<byte[]> ExportInvoicePdfAsync(long bookingId);
    Task<byte[]> ExportConfirmationPdfAsync(long bookingId);
}