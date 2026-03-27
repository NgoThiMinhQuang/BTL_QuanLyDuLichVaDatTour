using BLL.DTOs.Payment;
using BLL.Interfaces;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;

namespace BLL.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly INguoiDungRepository _nguoiDungRepository;

    public PaymentService(IPaymentRepository paymentRepository, IBookingRepository bookingRepository, INguoiDungRepository nguoiDungRepository)
    {
        _paymentRepository = paymentRepository;
        _bookingRepository = bookingRepository;
        _nguoiDungRepository = nguoiDungRepository;
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
        await _nguoiDungRepository.GetByIdAsync(adminUserId)
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

    private async Task<decimal> TinhTongTienThanhCongAsync(long bookingId, long currentPaymentId, decimal currentPaymentAmount)
    {
        var payments = await _paymentRepository.GetByBookingIdAsync(bookingId);
        return payments
            .Where(x => x.TrangThai == TrangThaiGiaoDichThanhToan.thanh_cong || x.Id == currentPaymentId)
            .Sum(x => x.Id == currentPaymentId ? currentPaymentAmount : x.SoTien);
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
