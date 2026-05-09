using BE_QuanLyDuLichVaDatTour.DTOs.Payment;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly INguoiDungRepository _nguoiDungRepository;
    private readonly ILichKhoiHanhRepository _lichKhoiHanhRepository;
    private readonly IBangGiaLichKhoiHanhRepository _bangGiaLichKhoiHanhRepository;
    private readonly IVoucherRepository _voucherRepository;

    public PaymentService(
        IPaymentRepository paymentRepository,
        IBookingRepository bookingRepository,
        INguoiDungRepository nguoiDungRepository,
        ILichKhoiHanhRepository lichKhoiHanhRepository,
        IBangGiaLichKhoiHanhRepository bangGiaLichKhoiHanhRepository,
        IVoucherRepository voucherRepository)
    {
        _paymentRepository = paymentRepository;
        _bookingRepository = bookingRepository;
        _nguoiDungRepository = nguoiDungRepository;
        _lichKhoiHanhRepository = lichKhoiHanhRepository;
        _bangGiaLichKhoiHanhRepository = bangGiaLichKhoiHanhRepository;
        _voucherRepository = voucherRepository;
    }

    public async Task<PaymentResponseDto> CreateAsync(long currentUserId, CreatePaymentRequestDto request)
    {
        var booking = await _bookingRepository.GetTrackedByIdAsync(request.BookingId)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        if (booking.KhachHangId != currentUserId)
        {
            throw new KeyNotFoundException("Booking không tồn tại.");
        }

        if (booking.TrangThaiBooking == TrangThaiBooking.da_huy || booking.TrangThaiBooking == TrangThaiBooking.hoan_tat)
        {
            throw new InvalidOperationException("Không thể tạo thanh toán cho booking ở trạng thái hiện tại.");
        }

        if (request.SoTien <= 0)
        {
            throw new InvalidOperationException("Số tiền thanh toán phải lớn hơn 0.");
        }

        var soTienConLai = booking.TongTien - booking.SoTienDaThanhToan;
        if (soTienConLai <= 0)
        {
            throw new InvalidOperationException("Booking này đã thanh toán đủ.");
        }

        if (request.SoTien > soTienConLai)
        {
            throw new InvalidOperationException("Số tiền thanh toán vượt quá số tiền còn lại của booking.");
        }

        var now = DateTime.UtcNow;
        var thanhToan = new ThanhToan
        {
            BookingId = booking.Id,
            LoaiGiaoDich = request.LoaiGiaoDich,
            KenhThanhToan = string.IsNullOrWhiteSpace(request.MaGiaoDichBenThuBa)
                ? KenhThanhToan.noi_bo
                : KenhThanhToan.ben_thu_ba,
            PhuongThucThanhToan = request.PhuongThucThanhToan,
            NhaCungCap = NormalizeOptionalValue(request.NhaCungCap),
            SoTien = request.SoTien,
            MaGiaoDichNoiBo = await _paymentRepository.GenerateInternalTransactionCodeAsync(),
            MaGiaoDichBenThuBa = NormalizeOptionalValue(request.MaGiaoDichBenThuBa),
            MaThamChieuBenThuBa = NormalizeOptionalValue(request.MaThamChieuBenThuBa),
            DuLieuPhanHoi = NormalizeOptionalValue(request.DuLieuPhanHoi),
            GhiChu = NormalizeOptionalValue(request.GhiChu),
            TrangThai = TrangThaiGiaoDichThanhToan.cho_xu_ly,
            ThoiGianTao = now,
            UpdatedAt = now,
            Booking = booking
        };

        await _paymentRepository.AddAsync(thanhToan);
        await _paymentRepository.SaveChangesAsync();

        var created = await _paymentRepository.GetByIdAsync(thanhToan.Id)
            ?? throw new KeyNotFoundException("Thanh toán không tồn tại.");

        return MapResponse(created);
    }

    public async Task<List<PaymentResponseDto>> GetByBookingIdAsync(long currentUserId, long bookingId)
    {
        var booking = await _bookingRepository.GetByIdAsync(bookingId)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        if (booking.KhachHangId != currentUserId)
        {
            throw new KeyNotFoundException("Booking không tồn tại.");
        }

        var payments = await _paymentRepository.GetByBookingIdAsync(bookingId);
        return payments.Select(MapResponse).ToList();
    }

    public async Task<PaymentResponseDto> GetByIdAsync(long currentUserId, long id)
    {
        var payment = await _paymentRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Thanh toán không tồn tại.");

        if (payment.Booking?.KhachHangId != currentUserId)
        {
            throw new KeyNotFoundException("Thanh toán không tồn tại.");
        }

        return MapResponse(payment);
    }

    public async Task<List<PaymentResponseDto>> GetAllAsync()
    {
        var payments = await _paymentRepository.GetAllAsync();
        return payments.Select(MapResponse).ToList();
    }

    public async Task<PaymentResponseDto> GetAdminByIdAsync(long id)
    {
        var payment = await _paymentRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Thanh toán không tồn tại.");

        return MapResponse(payment);
    }

    public async Task UpdateStatusAsync(long adminUserId, long id, UpdatePaymentStatusRequestDto request)
    {
        _ = await _nguoiDungRepository.GetByIdAsync(adminUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        var payment = await _paymentRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Thanh toán không tồn tại.");

        var booking = await _bookingRepository.GetTrackedByIdAsync(payment.BookingId)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        payment.TrangThai = request.TrangThai;
        payment.GhiChu = NormalizeOptionalValue(request.GhiChu) ?? payment.GhiChu;
        payment.UpdatedAt = DateTime.UtcNow;

        if (request.TrangThai == TrangThaiGiaoDichThanhToan.thanh_cong)
        {
            booking.SoTienDaThanhToan = await TinhTongTienThanhCongAsync(booking.Id, payment.Id, payment.SoTien);
            booking.TrangThaiThanhToan = booking.SoTienDaThanhToan >= booking.TongTien
                ? TrangThaiThanhToan.da_thanh_toan_du
                : TrangThaiThanhToan.thanh_toan_mot_phan;

            if (booking.SoTienDaThanhToan > 0 && booking.TrangThaiBooking == TrangThaiBooking.cho_thanh_toan)
            {
                booking.TrangThaiBooking = booking.SoTienDaThanhToan >= booking.TienCocYeuCau && booking.TienCocYeuCau > 0
                    ? TrangThaiBooking.da_coc
                    : TrangThaiBooking.cho_thanh_toan;
            }
        }
        else if (request.TrangThai == TrangThaiGiaoDichThanhToan.that_bai)
        {
            booking.TrangThaiThanhToan = booking.SoTienDaThanhToan > 0
                ? TrangThaiThanhToan.thanh_toan_mot_phan
                : TrangThaiThanhToan.that_bai;
        }
        else if (request.TrangThai == TrangThaiGiaoDichThanhToan.da_hoan_tien)
        {
            booking.TrangThaiThanhToan = TrangThaiThanhToan.da_hoan_tien;
        }

        booking.UpdatedAt = DateTime.UtcNow;
        await _paymentRepository.SaveChangesAsync();
    }

    public async Task<PaymentResponseDto> ConfirmAsync(long adminUserId, long id, ConfirmPaymentRequestDto request)
    {
        _ = await _nguoiDungRepository.GetByIdAsync(adminUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        var payment = await _paymentRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Thanh toán không tồn tại.");

        var booking = await _bookingRepository.GetTrackedByIdAsync(payment.BookingId)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        if (payment.TrangThai != TrangThaiGiaoDichThanhToan.cho_xu_ly)
        {
            throw new InvalidOperationException("Chỉ có thể xác nhận thanh toán đang chờ xử lý.");
        }

        var ghiChu = NormalizeOptionalValue(request.GhiChu);
        payment.TrangThai = TrangThaiGiaoDichThanhToan.thanh_cong;
        payment.GhiChu = ghiChu ?? payment.GhiChu;
        payment.UpdatedAt = DateTime.UtcNow;

        booking.SoTienDaThanhToan = await TinhTongTienThanhCongAsync(booking.Id, payment.Id, payment.SoTien);
        booking.TrangThaiThanhToan = booking.SoTienDaThanhToan >= booking.TongTien
            ? TrangThaiThanhToan.da_thanh_toan_du
            : TrangThaiThanhToan.thanh_toan_mot_phan;

        if (booking.SoTienDaThanhToan > 0 && booking.TrangThaiBooking == TrangThaiBooking.cho_thanh_toan)
        {
            booking.TrangThaiBooking = booking.SoTienDaThanhToan >= booking.TienCocYeuCau && booking.TienCocYeuCau > 0
                ? TrangThaiBooking.da_coc
                : TrangThaiBooking.cho_thanh_toan;
        }

        booking.UpdatedAt = DateTime.UtcNow;
        await _paymentRepository.SaveChangesAsync();

        var result = await _paymentRepository.GetByIdAsync(id);
        return MapResponse(result!);
    }

    public async Task<PaymentResponseDto> RefundAsync(long adminUserId, long id, RefundRequestDto request)
    {
        _ = await _nguoiDungRepository.GetByIdAsync(adminUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        var payment = await _paymentRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Thanh toán không tồn tại.");

        if (payment.TrangThai != TrangThaiGiaoDichThanhToan.thanh_cong)
        {
            throw new InvalidOperationException("Chỉ có thể hoàn tiền cho thanh toán đã thành công.");
        }

        var booking = await _bookingRepository.GetTrackedByIdAsync(payment.BookingId)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        var soTienHoan = request.HoanToanBo ? payment.SoTien : request.SoTien;
        if (soTienHoan > payment.SoTien)
        {
            throw new InvalidOperationException("Số tiền hoàn không được vượt quá số tiền đã thanh toán.");
        }

        var now = DateTime.UtcNow;
        var refund = new ThanhToan
        {
            BookingId = booking.Id,
            LoaiGiaoDich = LoaiGiaoDichThanhToan.hoan_tien,
            KenhThanhToan = payment.KenhThanhToan,
            PhuongThucThanhToan = payment.PhuongThucThanhToan,
            NhaCungCap = payment.NhaCungCap,
            SoTien = -soTienHoan,
            MaGiaoDichNoiBo = await _paymentRepository.GenerateInternalTransactionCodeAsync(),
            GhiChu = $"Hoàn tiền cho thanh toán #{payment.Id}. Lý do: {request.LyDo}",
            TrangThai = TrangThaiGiaoDichThanhToan.da_hoan_tien,
            ThoiGianTao = now,
            UpdatedAt = now,
            Booking = booking
        };

        await _paymentRepository.AddAsync(refund);
        payment.TrangThai = TrangThaiGiaoDichThanhToan.da_hoan_tien;
        payment.UpdatedAt = now;

        booking.SoTienDaThanhToan = Math.Max(0, await TinhTongTienThanhCongAsync(booking.Id, payment.Id, -soTienHoan));
        booking.TrangThaiThanhToan = booking.SoTienDaThanhToan <= 0
            ? TrangThaiThanhToan.da_hoan_tien
            : TrangThaiThanhToan.thanh_toan_mot_phan;
        booking.UpdatedAt = now;

        await _paymentRepository.SaveChangesAsync();
        return MapResponse(refund);
    }

    public async Task<object> PreviewPriceAsync(long currentUserId, PricePreviewRequestDto request)
    {
        await _nguoiDungRepository.GetByIdAsync(currentUserId);

        var lichKhoiHanh = await _lichKhoiHanhRepository.GetByIdAsync(request.LichKhoiHanhId)
            ?? throw new KeyNotFoundException("Lịch khởi hành không tồn tại.");

        if (lichKhoiHanh.Tour is null)
            throw new KeyNotFoundException("Tour không tồn tại.");

        var loaiGiaApDung = lichKhoiHanh.NgayKhoiHanh.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday
            ? LoaiGiaApDung.cuoi_tuan
            : LoaiGiaApDung.ngay_thuong;

        var bangGia = await _bangGiaLichKhoiHanhRepository.GetBangGiaAsync(lichKhoiHanh.Id, loaiGiaApDung);

        decimal GetDonGia(LoaiKhach loaiKhach, string ten)
        {
            if (!bangGia.TryGetValue(loaiKhach, out var dg))
                throw new InvalidOperationException($"Chưa cấu hình bảng giá cho {ten}.");
            return dg;
        }

        var donGiaNguoiLon = GetDonGia(LoaiKhach.nguoi_lon, "người lớn");
        var donGiaTreEm = GetDonGia(LoaiKhach.tre_em, "trẻ em");
        var donGiaEmBe = GetDonGia(LoaiKhach.em_be, "em bé");

        var tamTinh = request.SoNguoiLon * donGiaNguoiLon
            + request.SoTreEm * donGiaTreEm
            + request.SoEmBe * donGiaEmBe;

        decimal giamGia = 0;
        string? maVoucher = null;
        string? tenVoucher = null;

        if (request.VoucherId.HasValue || !string.IsNullOrWhiteSpace(request.MaVoucher))
        {
            Voucher? voucher = null;
            if (request.VoucherId.HasValue)
            {
                voucher = await _voucherRepository.GetByIdAsync(request.VoucherId.Value);
            }
            else if (!string.IsNullOrWhiteSpace(request.MaVoucher))
            {
                voucher = await _voucherRepository.GetByMaVoucherAsync(request.MaVoucher.Trim());
            }

            if (voucher != null)
            {
                try
                {
                    ValidateVoucherForPreview(voucher, lichKhoiHanh.TourId, tamTinh);
                    giamGia = CalculateVoucherDiscount(voucher, tamTinh);
                    maVoucher = voucher.MaVoucher;
                    tenVoucher = voucher.TenVoucher;
                }
                catch (InvalidOperationException)
                {
                    giamGia = 0;
                    maVoucher = null;
                    tenVoucher = null;
                }
            }
        }

        return new
        {
            LichKhoiHanhId = request.LichKhoiHanhId,
            MaDotTour = lichKhoiHanh.MaDotTour,
            TenTour = lichKhoiHanh.Tour.TenTour,
            NgayKhoiHanh = lichKhoiHanh.NgayKhoiHanh,
            NgayKetThuc = lichKhoiHanh.NgayKetThuc,
            SoChoConLai = lichKhoiHanh.SoChoToiDa - (await _bookingRepository.GetBookedSeatsAsync(lichKhoiHanh.Id)),
            LoaiGiaApDung = loaiGiaApDung.ToString(),
            DonGiaNguoiLon = donGiaNguoiLon,
            DonGiaTreEm = donGiaTreEm,
            DonGiaEmBe = donGiaEmBe,
            SoNguoiLon = request.SoNguoiLon,
            SoTreEm = request.SoTreEm,
            SoEmBe = request.SoEmBe,
            TamTinh = tamTinh,
            GiamGia = giamGia,
            MaVoucher = maVoucher,
            TenVoucher = tenVoucher,
            TongTien = tamTinh - giamGia
        };
    }

    private async Task<decimal> TinhTongTienThanhCongAsync(long bookingId, long currentPaymentId, decimal currentPaymentAmount)
    {
        var payments = await _paymentRepository.GetByBookingIdAsync(bookingId);
        return payments
            .Where(x => x.TrangThai == TrangThaiGiaoDichThanhToan.thanh_cong || x.Id == currentPaymentId)
            .Sum(x => x.Id == currentPaymentId ? currentPaymentAmount : x.SoTien);
    }

    private static void ValidateVoucherForPreview(Voucher voucher, long tourId, decimal tamTinh)
    {
        var now = DateTime.UtcNow;

        if (voucher.TrangThai != TrangThaiVoucher.hoat_dong)
            throw new InvalidOperationException("Voucher hiện không hoạt động.");

        if (voucher.NgayBatDau > now || voucher.NgayKetThuc < now)
            throw new InvalidOperationException("Voucher hiện không nằm trong thời gian áp dụng.");

        if (voucher.SoLuongDaDung >= voucher.SoLuongToiDa)
            throw new InvalidOperationException("Voucher đã hết lượt sử dụng.");

        if (voucher.TourId.HasValue && voucher.TourId.Value != tourId)
            throw new InvalidOperationException("Voucher không áp dụng cho tour này.");

        if (tamTinh < voucher.DonHangToiThieu)
            throw new InvalidOperationException("Booking chưa đạt giá trị tối thiểu để áp dụng voucher.");
    }

    private static decimal CalculateVoucherDiscount(Voucher voucher, decimal tamTinh)
    {
        var giamGia = voucher.KieuGiam == KieuGiamVoucher.phan_tram
            ? tamTinh * voucher.GiaTriGiam / 100m
            : voucher.GiaTriGiam;

        if (voucher.GiamToiDa.HasValue && giamGia > voucher.GiamToiDa.Value)
            giamGia = voucher.GiamToiDa.Value;

        return giamGia > tamTinh ? tamTinh : giamGia;
    }

    private static string? NormalizeOptionalValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    private static PaymentResponseDto MapResponse(ThanhToan payment)
    {
        return new PaymentResponseDto
        {
            Id = payment.Id,
            BookingId = payment.BookingId,
            MaBooking = payment.Booking?.MaBooking ?? string.Empty,
            HoTenKhachHang = payment.Booking?.KhachHang?.HoTen ?? string.Empty,
            LoaiGiaoDich = payment.LoaiGiaoDich.ToString(),
            KenhThanhToan = payment.KenhThanhToan.ToString(),
            PhuongThucThanhToan = payment.PhuongThucThanhToan.ToString(),
            NhaCungCap = payment.NhaCungCap,
            SoTien = payment.SoTien,
            MaGiaoDichNoiBo = payment.MaGiaoDichNoiBo,
            MaGiaoDichBenThuBa = payment.MaGiaoDichBenThuBa,
            MaThamChieuBenThuBa = payment.MaThamChieuBenThuBa,
            DuLieuPhanHoi = payment.DuLieuPhanHoi,
            GhiChu = payment.GhiChu,
            TrangThai = payment.TrangThai.ToString(),
            ThoiGianTao = payment.ThoiGianTao,
            UpdatedAt = payment.UpdatedAt
        };
    }
}
