using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.Admin;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class InvoiceExportService : IInvoiceExportService
{
    private readonly AppDbContext _dbContext;

    public InvoiceExportService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<byte[]> ExportInvoicePdfAsync(long bookingId)
    {
        var booking = await _dbContext.Bookings
            .AsNoTracking()
            .Include(b => b.LichKhoiHanh).ThenInclude(l => l!.Tour)
            .Include(b => b.HanhKhachs)
            .Include(b => b.ThanhToans)
            .Include(b => b.Voucher)
            .Include(b => b.KhachHang)
            .FirstOrDefaultAsync(b => b.Id == bookingId)
            ?? throw new KeyNotFoundException("Không tìm thấy booking.");

        var dto = MapToDto(booking);
        return GeneratePdf(dto);
    }

    private static InvoiceExportDto MapToDto(Models.Entities.Booking booking)
    {
        var invoice = new InvoiceExportDto
        {
            BookingId = booking.Id,
            MaBooking = booking.MaBooking,
            TenTour = booking.LichKhoiHanh?.Tour?.TenTour ?? "—",
            MaTour = booking.LichKhoiHanh?.Tour?.MaTour ?? "—",
            MaDotTour = booking.LichKhoiHanh?.MaDotTour ?? "—",
            NgayKhoiHanh = booking.LichKhoiHanh?.NgayKhoiHanh.ToString("dd/MM/yyyy") ?? "—",
            NgayKetThuc = booking.LichKhoiHanh?.NgayKetThuc.ToString("dd/MM/yyyy") ?? "—",
            HoTenLienHe = booking.HoTenLienHe,
            EmailLienHe = booking.EmailLienHe,
            SoDienThoaiLienHe = booking.SoDienThoaiLienHe,
            DiaChiLienHe = booking.DiaChiLienHe,
            SoNguoiLon = booking.SoNguoiLon,
            SoTreEm = booking.SoTreEm,
            SoEmBe = booking.SoEmBe,
            TongHanhKhach = booking.SoNguoiLon + booking.SoTreEm + booking.SoEmBe,
            LoaiGiaApDung = booking.LoaiGiaApDung.ToString(),
            DonGiaNguoiLon = booking.DonGiaNguoiLon,
            DonGiaTreEm = booking.DonGiaTreEm,
            DonGiaEmBe = booking.DonGiaEmBe,
            TamTinh = booking.TamTinh,
            GiamGia = booking.GiamGia,
            MaVoucher = booking.Voucher?.MaVoucher,
            TongTien = booking.TongTien,
            TrangThaiBooking = booking.TrangThaiBooking.ToString(),
            TrangThaiThanhToan = booking.TrangThaiThanhToan.ToString(),
            NgayDat = booking.NgayDat,
            NgayIn = DateTime.Now.ToString("dd/MM/yyyy HH:mm"),
        };

        invoice.HanhKhachs = booking.HanhKhachs.Select(h => new InvoiceTravelerDto
        {
            HoTen = h.HoTen,
            LoaiKhach = h.LoaiKhach.ToString(),
            NgaySinh = h.NgaySinh?.ToString("dd/MM/yyyy"),
            GioiTinh = h.GioiTinh,
            SoGiayTo = h.SoGiayTo,
        }).ToList();

        invoice.ThanhToans = booking.ThanhToans.Select(t => new InvoicePaymentDto
        {
            MaGiaoDich = t.MaGiaoDichNoiBo ?? t.Id.ToString(),
            LoaiGiaoDich = t.LoaiGiaoDich.ToString(),
            PhuongThuc = t.PhuongThucThanhToan.ToString(),
            SoTien = t.SoTien,
            TrangThai = t.TrangThai.ToString(),
            ThoiGian = t.ThoiGianTao.ToString("dd/MM/yyyy HH:mm"),
        }).ToList();

        return invoice;
    }

    private static byte[] GeneratePdf(InvoiceExportDto dto)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Element(c => ComposeHeader(c, dto));
                page.Content().Element(c => ComposeContent(c, dto));
                page.Footer().Element(ComposeFooter);
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeHeader(IContainer container, InvoiceExportDto dto)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(col =>
            {
                col.Item().Text("TravelTour").FontSize(20).Bold().FontColor(Colors.Teal.Darken1);
                col.Item().Text("Công ty Du Lịch & Đặt Tour").FontSize(10).FontColor(Colors.Grey.Darken1);
                col.Item().Text("123 Đường ABC, Quận 1, TP.HCM").FontSize(9).FontColor(Colors.Grey.Medium);
                col.Item().Text("Hotline: 1900 1234 | Email: info@traveltour.vn").FontSize(9).FontColor(Colors.Grey.Medium);
            });

            row.RelativeItem().AlignRight().Column(col =>
            {
                col.Item().Text("HÓA ĐƠN").FontSize(24).Bold().FontColor(Colors.Teal.Darken1);
                col.Item().Text($"#{dto.MaBooking}").FontSize(12).Bold();
                col.Item().Text($"Ngày đặt: {dto.NgayDat:dd/MM/yyyy}").FontSize(10);
                col.Item().Text($"In lúc: {dto.NgayIn}").FontSize(9).FontColor(Colors.Grey.Medium);
            });
        });

        container.PaddingVertical(16).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
    }

    private static void ComposeContent(IContainer container, InvoiceExportDto dto)
    {
        container.PaddingTop(16).Column(col =>
        {
            col.Item().PaddingBottom(12).Column(c =>
            {
                c.Item().Text("THÔNG TIN TOUR").FontSize(11).Bold().FontColor(Colors.Teal.Darken1);
                c.Item().PaddingTop(6).Table(t =>
                {
                    t.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(140);
                        columns.RelativeColumn();
                    });
                    t.Cell().Text("Tour:").Bold();
                    t.Cell().Text($"{dto.TenTour} ({dto.MaTour})");
                    t.Cell().Text("Mã đợt tour:");
                    t.Cell().Text(dto.MaDotTour);
                    t.Cell().Text("Khởi hành:");
                    t.Cell().Text($"{dto.NgayKhoiHanh} — {dto.NgayKetThuc}");
                });
            });

            col.Item().PaddingBottom(12).Column(c =>
            {
                c.Item().Text("THÔNG TIN LIÊN HỆ").FontSize(11).Bold().FontColor(Colors.Teal.Darken1);
                c.Item().PaddingTop(6).Table(t =>
                {
                    t.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(140);
                        columns.RelativeColumn();
                    });
                    t.Cell().Text("Họ tên:");
                    t.Cell().Text(dto.HoTenLienHe);
                    t.Cell().Text("Email:");
                    t.Cell().Text(dto.EmailLienHe);
                    t.Cell().Text("Điện thoại:");
                    t.Cell().Text(dto.SoDienThoaiLienHe);
                    if (!string.IsNullOrEmpty(dto.DiaChiLienHe))
                    {
                        t.Cell().Text("Địa chỉ:");
                        t.Cell().Text(dto.DiaChiLienHe);
                    }
                });
            });

            col.Item().PaddingBottom(12).Column(c =>
            {
                c.Item().Text("HÀNH KHÁCH").FontSize(11).Bold().FontColor(Colors.Teal.Darken1);
                c.Item().PaddingTop(6).Table(t =>
                {
                    t.ColumnsDefinition(columns =>
                    {
                        columns.ConstantColumn(30);
                        columns.RelativeColumn(3);
                        columns.ConstantColumn(80);
                        columns.ConstantColumn(100);
                        columns.RelativeColumn(2);
                    });
                    t.Header(header =>
                    {
                        header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("#").Bold();
                        header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("Họ tên").Bold();
                        header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("Loại").Bold();
                        header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("Ngày sinh").Bold();
                        header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("Giới tính / Số giấy tờ").Bold();
                    });

                    for (var i = 0; i < dto.HanhKhachs.Count; i++)
                    {
                        var h = dto.HanhKhachs[i];
                        var bg = i % 2 == 0 ? Colors.White : Colors.Grey.Lighten4;
                        t.Cell().Background(bg).Padding(4).Text($"{i + 1}");
                        t.Cell().Background(bg).Padding(4).Text(h.HoTen);
                        t.Cell().Background(bg).Padding(4).Text(h.LoaiKhach);
                        t.Cell().Background(bg).Padding(4).Text(h.NgaySinh ?? "—");
                        t.Cell().Background(bg).Padding(4).Text($"{h.GioiTinh ?? ""} {h.SoGiayTo ?? ""}".Trim());
                    }

                    t.Cell().ColumnSpan(5).PaddingTop(4).Text($"Tổng: {dto.TongHanhKhach} khách ({dto.SoNguoiLon} người lớn, {dto.SoTreEm} trẻ em, {dto.SoEmBe} em bé)").Bold();
                });
            });

            col.Item().PaddingBottom(12).Column(c =>
            {
                c.Item().Text("CHI TIẾT THANH TOÁN").FontSize(11).Bold().FontColor(Colors.Teal.Darken1);
                c.Item().PaddingTop(6).Table(t =>
                {
                    t.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.ConstantColumn(120);
                    });
                    t.Cell().Padding(4).Text($"{dto.LoaiGiaApDung}");
                    t.Cell().AlignRight().Padding(4).Text("");
                    t.Cell().Padding(4).Text($"Người lớn x{dto.SoNguoiLon}:");
                    t.Cell().AlignRight().Padding(4).Text($"{dto.DonGiaNguoiLon:N0} đ");
                    t.Cell().Padding(4).Text($"Trẻ em x{dto.SoTreEm}:");
                    t.Cell().AlignRight().Padding(4).Text($"{dto.DonGiaTreEm:N0} đ");
                    t.Cell().Padding(4).Text($"Em bé x{dto.SoEmBe}:");
                    t.Cell().AlignRight().Padding(4).Text($"{dto.DonGiaEmBe:N0} đ");
                    t.Cell().PaddingVertical(6).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
                    t.Cell().Padding(4).Text("Tạm tính:");
                    t.Cell().AlignRight().Padding(4).Text($"{dto.TamTinh:N0} đ");

                    if (dto.GiamGia > 0)
                    {
                        t.Cell().Padding(4).Text($"Giảm giá {(dto.MaVoucher != null ? $"({dto.MaVoucher})" : "")}:");
                        t.Cell().AlignRight().Padding(4).Text($"-{dto.GiamGia:N0} đ").FontColor(Colors.Green.Darken1);
                    }

                    t.Cell().Background(Colors.Teal.Lighten4).Padding(8).Text("TỔNG CỘNG:").Bold();
                    t.Cell().Background(Colors.Teal.Lighten4).AlignRight().Padding(8).Text($"{dto.TongTien:N0} đ").Bold().FontColor(Colors.Teal.Darken2);
                });
            });

            if (dto.ThanhToans.Count > 0)
            {
                col.Item().Column(c =>
                {
                    c.Item().Text("LỊCH SỬ THANH TOÁN").FontSize(11).Bold().FontColor(Colors.Teal.Darken1);
                    c.Item().PaddingTop(6).Table(t =>
                    {
                        t.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(100);
                            columns.ConstantColumn(100);
                            columns.ConstantColumn(100);
                            columns.ConstantColumn(80);
                            columns.RelativeColumn();
                        });
                        t.Header(header =>
                        {
                            header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("Mã GD").Bold();
                            header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("Loại").Bold();
                            header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("Phương thức").Bold();
                            header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("Số tiền").Bold();
                            header.Cell().Background(Colors.Teal.Lighten4).Padding(4).Text("Thời gian / Trạng thái").Bold();
                        });

                        for (var i = 0; i < dto.ThanhToans.Count; i++)
                        {
                            var p = dto.ThanhToans[i];
                            var bg = i % 2 == 0 ? Colors.White : Colors.Grey.Lighten4;
                            t.Cell().Background(bg).Padding(4).Text(p.MaGiaoDich);
                            t.Cell().Background(bg).Padding(4).Text(p.LoaiGiaoDich);
                            t.Cell().Background(bg).Padding(4).Text(p.PhuongThuc);
                            t.Cell().Background(bg).Padding(4).Text($"{p.SoTien:N0} đ");
                            t.Cell().Background(bg).Padding(4).Text($"{p.ThoiGian} / {p.TrangThai}");
                        }
                    });
                });
            }
        });
    }

    public async Task<byte[]> ExportConfirmationPdfAsync(long bookingId)
    {
        var booking = await _dbContext.Bookings
            .AsNoTracking()
            .Include(b => b.LichKhoiHanh).ThenInclude(l => l!.Tour)
            .Include(b => b.HanhKhachs)
            .Include(b => b.KhachHang)
            .FirstOrDefaultAsync(b => b.Id == bookingId)
            ?? throw new KeyNotFoundException("Không tìm thấy booking.");

        var dto = MapToDto(booking);
        return GenerateConfirmationPdf(dto);
    }

    private static byte[] GenerateConfirmationPdf(InvoiceExportDto dto)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Element(c => ComposeConfirmationHeader(c, dto));
                page.Content().Element(c => ComposeContent(c, dto));
                page.Footer().Element(ComposeConfirmationFooter);
            });
        });

        return document.GeneratePdf();
    }

    private static void ComposeConfirmationHeader(IContainer container, InvoiceExportDto dto)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(col =>
            {
                col.Item().Text("TravelTour").FontSize(20).Bold().FontColor(Colors.Blue.Darken1);
                col.Item().Text("Công ty Du Lịch & Đặt Tour").FontSize(10).FontColor(Colors.Grey.Darken1);
                col.Item().Text("123 Đường ABC, Quận 1, TP.HCM").FontSize(9).FontColor(Colors.Grey.Medium);
                col.Item().Text("Hotline: 1900 1234 | Email: info@traveltour.vn").FontSize(9).FontColor(Colors.Grey.Medium);
            });

            row.RelativeItem().AlignRight().Column(col =>
            {
                col.Item().Text("PHIẾU XÁC NHẬN").FontSize(22).Bold().FontColor(Colors.Blue.Darken1);
                col.Item().Text("ĐẶT TOUR").FontSize(14).Bold().FontColor(Colors.Blue.Medium);
                col.Item().Text($"#{dto.MaBooking}").FontSize(12).Bold();
                col.Item().Text($"Ngày đặt: {dto.NgayDat:dd/MM/yyyy}").FontSize(10);
            });
        });

        container.PaddingVertical(16).LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
    }

    private static void ComposeConfirmationFooter(IContainer container)
    {
        container.AlignCenter().Column(col =>
        {
            col.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
            col.Item().PaddingTop(8).AlignCenter().Text("Cảm ơn quý khách đã tin tưởng TravelTour!").FontSize(10).FontColor(Colors.Grey.Darken1);
            col.Item().AlignCenter().Text("Vui lòng mang theo phiếu xác nhận này khi đi tour").FontSize(9).FontColor(Colors.Grey.Medium);
        });
    }

    private static void ComposeFooter(IContainer container)
    {
        container.AlignCenter().Column(col =>
        {
            col.Item().LineHorizontal(1).LineColor(Colors.Grey.Lighten2);
            col.Item().PaddingTop(8).AlignCenter().Text("Cảm ơn quý khách đã tin tưởng TravelTour!").FontSize(10).FontColor(Colors.Grey.Darken1);
            col.Item().AlignCenter().Text("Hóa đơn được tạo tự động — không cần chữ ký").FontSize(9).FontColor(Colors.Grey.Medium);
        });
    }
}