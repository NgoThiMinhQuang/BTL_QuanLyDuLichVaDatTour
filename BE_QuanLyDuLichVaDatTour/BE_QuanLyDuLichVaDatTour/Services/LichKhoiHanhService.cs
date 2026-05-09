using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.LichKhoiHanh;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class LichKhoiHanhService : ILichKhoiHanhService
{
    private readonly ILichKhoiHanhRepository _lichKhoiHanhRepository;
    private readonly ITourRepository _tourRepository;
    private readonly IBangGiaLichKhoiHanhRepository _bangGiaLichKhoiHanhRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly AppDbContext _dbContext;

    public LichKhoiHanhService(
        ILichKhoiHanhRepository lichKhoiHanhRepository,
        ITourRepository tourRepository,
        IBangGiaLichKhoiHanhRepository bangGiaLichKhoiHanhRepository,
        IBookingRepository bookingRepository,
        AppDbContext dbContext)
    {
        _lichKhoiHanhRepository = lichKhoiHanhRepository;
        _tourRepository = tourRepository;
        _bangGiaLichKhoiHanhRepository = bangGiaLichKhoiHanhRepository;
        _bookingRepository = bookingRepository;
        _dbContext = dbContext;
    }

    public async Task<List<LichKhoiHanhAdminResponseDto>> GetAllAsync()
    {
        var lichKhoiHanhs = await _lichKhoiHanhRepository.GetAllAsync();
        return await MapAdminResponsesAsync(lichKhoiHanhs);
    }

    public async Task<LichKhoiHanhAdminResponseDto> GetByIdAsync(long id)
    {
        var lichKhoiHanh = await _lichKhoiHanhRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Lịch khởi hành không tồn tại.");

        return await MapAdminResponseAsync(lichKhoiHanh);
    }

    public async Task<List<LichKhoiHanhAdminResponseDto>> GetByTourIdAsync(long tourId)
    {
        await EnsureTourExistsAsync(tourId);

        var lichKhoiHanhs = await _lichKhoiHanhRepository.GetByTourIdAsync(tourId);
        return await MapAdminResponsesAsync(lichKhoiHanhs);
    }

    public async Task<List<LichKhoiHanhResponseDto>> GetVisibleByTourIdAsync(long tourId)
    {
        var tour = await _tourRepository.GetVisibleByIdAsync(tourId);
        if (tour is null)
        {
            return new List<LichKhoiHanhResponseDto>();
        }

        var lichKhoiHanhs = await _lichKhoiHanhRepository.GetVisibleByTourIdAsync(tour.Id);
        return await MapPublicResponsesAsync(lichKhoiHanhs);
    }

    public async Task<BangGiaLichKhoiHanhResponseDto> GetBangGiaAsync(long lichKhoiHanhId)
    {
        var lichKhoiHanh = await _lichKhoiHanhRepository.GetByIdAsync(lichKhoiHanhId)
            ?? throw new KeyNotFoundException("Lịch khởi hành không tồn tại.");

        var bangGiaNgayThuong = await _bangGiaLichKhoiHanhRepository.GetBangGiaAsync(lichKhoiHanhId, LoaiGiaApDung.ngay_thuong);
        var bangGiaCuoiTuan = await _bangGiaLichKhoiHanhRepository.GetBangGiaAsync(lichKhoiHanhId, LoaiGiaApDung.cuoi_tuan);

        return new BangGiaLichKhoiHanhResponseDto
        {
            LichKhoiHanhId = lichKhoiHanh.Id,
            GiaNguoiLonNgayThuong = bangGiaNgayThuong.GetValueOrDefault(LoaiKhach.nguoi_lon),
            GiaTreEmNgayThuong = bangGiaNgayThuong.GetValueOrDefault(LoaiKhach.tre_em),
            GiaEmBeNgayThuong = bangGiaNgayThuong.GetValueOrDefault(LoaiKhach.em_be),
            GiaNguoiLonCuoiTuan = bangGiaCuoiTuan.GetValueOrDefault(LoaiKhach.nguoi_lon),
            GiaTreEmCuoiTuan = bangGiaCuoiTuan.GetValueOrDefault(LoaiKhach.tre_em),
            GiaEmBeCuoiTuan = bangGiaCuoiTuan.GetValueOrDefault(LoaiKhach.em_be),
        };
    }

    public async Task<LichKhoiHanhAdminResponseDto> CreateAsync(CreateLichKhoiHanhRequestDto request)
    {
        var tour = await EnsureTourExistsAsync(request.TourId);
        var maDotTour = NormalizeRequiredValue(request.MaDotTour, "Mã đợt tour không được để trống.");

        ValidateDateRange(request.NgayKhoiHanh, request.NgayKetThuc);
        ValidateSoChoToiDa(request.SoChoToiDa);

        await EnsureMaDotTourIsUniqueAsync(maDotTour);

        var now = DateTime.UtcNow;
        var lichKhoiHanh = new LichKhoiHanh
        {
            TourId = tour.Id,
            MaDotTour = maDotTour,
            NgayKhoiHanh = request.NgayKhoiHanh,
            NgayKetThuc = request.NgayKetThuc,
            NoiTapTrung = NormalizeOptionalValue(request.NoiTapTrung),
            SoChoToiDa = checked((short)request.SoChoToiDa),
            GhiChu = NormalizeOptionalValue(request.GhiChu),
            LyDoHuy = NormalizeOptionalValue(request.LyDoHuy),
            TrangThai = request.TrangThai ?? TrangThaiLichKhoiHanh.mo_ban,
            CreatedAt = now,
            UpdatedAt = now,
            Tour = tour
        };

        await _lichKhoiHanhRepository.AddAsync(lichKhoiHanh);
        await _lichKhoiHanhRepository.SaveChangesAsync();

        return await MapAdminResponseAsync(lichKhoiHanh);
    }

    public async Task<LichKhoiHanhAdminResponseDto> UpdateAsync(long id, UpdateLichKhoiHanhRequestDto request)
    {
        var lichKhoiHanh = await _lichKhoiHanhRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Lịch khởi hành không tồn tại.");

        var tour = await EnsureTourExistsAsync(request.TourId);
        var maDotTour = NormalizeRequiredValue(request.MaDotTour, "Mã đợt tour không được để trống.");

        ValidateDateRange(request.NgayKhoiHanh, request.NgayKetThuc);
        ValidateSoChoToiDa(request.SoChoToiDa);

        await EnsureMaDotTourIsUniqueAsync(maDotTour, id);

        lichKhoiHanh.TourId = tour.Id;
        lichKhoiHanh.MaDotTour = maDotTour;
        lichKhoiHanh.NgayKhoiHanh = request.NgayKhoiHanh;
        lichKhoiHanh.NgayKetThuc = request.NgayKetThuc;
        lichKhoiHanh.NoiTapTrung = NormalizeOptionalValue(request.NoiTapTrung);
        lichKhoiHanh.SoChoToiDa = checked((short)request.SoChoToiDa);
        lichKhoiHanh.GhiChu = NormalizeOptionalValue(request.GhiChu);
        lichKhoiHanh.LyDoHuy = NormalizeOptionalValue(request.LyDoHuy);
        lichKhoiHanh.TrangThai = request.TrangThai;
        lichKhoiHanh.UpdatedAt = DateTime.UtcNow;
        lichKhoiHanh.Tour = tour;

        await _lichKhoiHanhRepository.SaveChangesAsync();

        return await MapAdminResponseAsync(lichKhoiHanh);
    }

    public async Task<BangGiaLichKhoiHanhResponseDto> UpsertBangGiaAsync(long lichKhoiHanhId, BangGiaLichKhoiHanhRequestDto request)
    {
        var lichKhoiHanh = await _lichKhoiHanhRepository.GetByIdAsync(lichKhoiHanhId)
            ?? throw new KeyNotFoundException("Lịch khởi hành không tồn tại.");

        var now = DateTime.UtcNow;
        var existing = await _dbContext.BangGiaLichKhoiHanhs
            .Where(x => x.LichKhoiHanhId == lichKhoiHanhId)
            .ToListAsync();

        _dbContext.BangGiaLichKhoiHanhs.RemoveRange(existing);

        var bangGias = new List<BangGiaLichKhoiHanh>
        {
            new() { LichKhoiHanhId = lichKhoiHanhId, LoaiKhach = LoaiKhach.nguoi_lon, LoaiGia = LoaiGiaApDung.ngay_thuong, DonGia = request.GiaNguoiLonNgayThuong, CreatedAt = now, UpdatedAt = now },
            new() { LichKhoiHanhId = lichKhoiHanhId, LoaiKhach = LoaiKhach.tre_em, LoaiGia = LoaiGiaApDung.ngay_thuong, DonGia = request.GiaTreEmNgayThuong, CreatedAt = now, UpdatedAt = now },
            new() { LichKhoiHanhId = lichKhoiHanhId, LoaiKhach = LoaiKhach.em_be, LoaiGia = LoaiGiaApDung.ngay_thuong, DonGia = request.GiaEmBeNgayThuong, CreatedAt = now, UpdatedAt = now },
            new() { LichKhoiHanhId = lichKhoiHanhId, LoaiKhach = LoaiKhach.nguoi_lon, LoaiGia = LoaiGiaApDung.cuoi_tuan, DonGia = request.GiaNguoiLonCuoiTuan, CreatedAt = now, UpdatedAt = now },
            new() { LichKhoiHanhId = lichKhoiHanhId, LoaiKhach = LoaiKhach.tre_em, LoaiGia = LoaiGiaApDung.cuoi_tuan, DonGia = request.GiaTreEmCuoiTuan, CreatedAt = now, UpdatedAt = now },
            new() { LichKhoiHanhId = lichKhoiHanhId, LoaiKhach = LoaiKhach.em_be, LoaiGia = LoaiGiaApDung.cuoi_tuan, DonGia = request.GiaEmBeCuoiTuan, CreatedAt = now, UpdatedAt = now },
        };

        _dbContext.BangGiaLichKhoiHanhs.AddRange(bangGias);
        await _dbContext.SaveChangesAsync();

        return new BangGiaLichKhoiHanhResponseDto
        {
            LichKhoiHanhId = lichKhoiHanhId,
            GiaNguoiLonNgayThuong = request.GiaNguoiLonNgayThuong,
            GiaTreEmNgayThuong = request.GiaTreEmNgayThuong,
            GiaEmBeNgayThuong = request.GiaEmBeNgayThuong,
            GiaNguoiLonCuoiTuan = request.GiaNguoiLonCuoiTuan,
            GiaTreEmCuoiTuan = request.GiaTreEmCuoiTuan,
            GiaEmBeCuoiTuan = request.GiaEmBeCuoiTuan,
        };
    }

    public async Task DeleteBangGiaAsync(long lichKhoiHanhId)
    {
        var lichKhoiHanh = await _lichKhoiHanhRepository.GetByIdAsync(lichKhoiHanhId)
            ?? throw new KeyNotFoundException("Lịch khởi hành không tồn tại.");

        var existing = await _dbContext.BangGiaLichKhoiHanhs
            .Where(x => x.LichKhoiHanhId == lichKhoiHanhId)
            .ToListAsync();

        _dbContext.BangGiaLichKhoiHanhs.RemoveRange(existing);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateStatusAsync(long id, UpdateLichKhoiHanhStatusRequestDto request)
    {
        var lichKhoiHanh = await _lichKhoiHanhRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Lịch khởi hành không tồn tại.");

        lichKhoiHanh.TrangThai = request.TrangThai;
        lichKhoiHanh.UpdatedAt = DateTime.UtcNow;

        await _lichKhoiHanhRepository.SaveChangesAsync();
    }

    private async Task<Tour> EnsureTourExistsAsync(long tourId)
    {
        return await _tourRepository.GetByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");
    }

    private async Task EnsureMaDotTourIsUniqueAsync(string maDotTour, long? currentId = null)
    {
        var existing = await _lichKhoiHanhRepository.GetByMaDotTourAsync(maDotTour);
        if (existing is not null && existing.Id != currentId)
        {
            throw new InvalidOperationException("Mã đợt tour đã tồn tại.");
        }
    }

    private static void ValidateDateRange(DateTime ngayKhoiHanh, DateTime ngayKetThuc)
    {
        if (ngayKetThuc.Date < ngayKhoiHanh.Date)
        {
            throw new InvalidOperationException("Ngày kết thúc không được nhỏ hơn ngày khởi hành.");
        }
    }

    private static void ValidateSoChoToiDa(int soChoToiDa)
    {
        if (soChoToiDa < 1)
        {
            throw new InvalidOperationException("Số chỗ tối đa phải lớn hơn 0.");
        }
    }

    private static string NormalizeRequiredValue(string value, string errorMessage)
    {
        var normalizedValue = value.Trim();
        if (string.IsNullOrWhiteSpace(normalizedValue))
        {
            throw new InvalidOperationException(errorMessage);
        }

        return normalizedValue;
    }

    private static string? NormalizeOptionalValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    private async Task<List<LichKhoiHanhAdminResponseDto>> MapAdminResponsesAsync(List<LichKhoiHanh> lichKhoiHanhs)
    {
        var responses = new List<LichKhoiHanhAdminResponseDto>(lichKhoiHanhs.Count);
        foreach (var lichKhoiHanh in lichKhoiHanhs)
        {
            responses.Add(await MapAdminResponseAsync(lichKhoiHanh));
        }

        return responses;
    }

    private async Task<List<LichKhoiHanhResponseDto>> MapPublicResponsesAsync(List<LichKhoiHanh> lichKhoiHanhs)
    {
        var responses = new List<LichKhoiHanhResponseDto>(lichKhoiHanhs.Count);
        foreach (var lichKhoiHanh in lichKhoiHanhs)
        {
            responses.Add(await MapPublicResponseAsync(lichKhoiHanh));
        }

        return responses;
    }

    private async Task<LichKhoiHanhAdminResponseDto> MapAdminResponseAsync(LichKhoiHanh lichKhoiHanh)
    {
        var soChoDaDat = await _bookingRepository.GetBookedSeatsAsync(lichKhoiHanh.Id);
        return new LichKhoiHanhAdminResponseDto
        {
            Id = lichKhoiHanh.Id,
            TourId = lichKhoiHanh.TourId,
            MaTour = lichKhoiHanh.Tour?.MaTour ?? string.Empty,
            TenTour = lichKhoiHanh.Tour?.TenTour ?? string.Empty,
            MaDotTour = lichKhoiHanh.MaDotTour,
            NgayKhoiHanh = lichKhoiHanh.NgayKhoiHanh,
            NgayKetThuc = lichKhoiHanh.NgayKetThuc,
            NoiTapTrung = lichKhoiHanh.NoiTapTrung,
            SoChoToiDa = lichKhoiHanh.SoChoToiDa,
            SoChoDaDat = soChoDaDat,
            SoChoConLai = Math.Max(lichKhoiHanh.SoChoToiDa - soChoDaDat, 0),
            GhiChu = lichKhoiHanh.GhiChu,
            LyDoHuy = lichKhoiHanh.LyDoHuy,
            TrangThai = lichKhoiHanh.TrangThai.ToString(),
            CreatedAt = lichKhoiHanh.CreatedAt,
            UpdatedAt = lichKhoiHanh.UpdatedAt
        };
    }

    private async Task<LichKhoiHanhResponseDto> MapPublicResponseAsync(LichKhoiHanh lichKhoiHanh)
    {
        var soChoDaDat = await _bookingRepository.GetBookedSeatsAsync(lichKhoiHanh.Id);
        return new LichKhoiHanhResponseDto
        {
            Id = lichKhoiHanh.Id,
            TourId = lichKhoiHanh.TourId,
            MaTour = lichKhoiHanh.Tour?.MaTour ?? string.Empty,
            TenTour = lichKhoiHanh.Tour?.TenTour ?? string.Empty,
            MaDotTour = lichKhoiHanh.MaDotTour,
            NgayKhoiHanh = lichKhoiHanh.NgayKhoiHanh,
            NgayKetThuc = lichKhoiHanh.NgayKetThuc,
            NoiTapTrung = lichKhoiHanh.NoiTapTrung,
            SoChoToiDa = lichKhoiHanh.SoChoToiDa,
            SoChoDaDat = soChoDaDat,
            SoChoConLai = Math.Max(lichKhoiHanh.SoChoToiDa - soChoDaDat, 0),
            TrangThai = lichKhoiHanh.TrangThai.ToString()
        };
    }
}
