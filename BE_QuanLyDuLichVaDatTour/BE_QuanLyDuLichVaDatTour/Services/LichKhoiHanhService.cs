using BE_QuanLyDuLichVaDatTour.DTOs.LichKhoiHanh;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class LichKhoiHanhService : ILichKhoiHanhService
{
    private readonly ILichKhoiHanhRepository _lichKhoiHanhRepository;
    private readonly ITourRepository _tourRepository;

    public LichKhoiHanhService(
        ILichKhoiHanhRepository lichKhoiHanhRepository,
        ITourRepository tourRepository)
    {
        _lichKhoiHanhRepository = lichKhoiHanhRepository;
        _tourRepository = tourRepository;
    }

    public async Task<List<LichKhoiHanhAdminResponseDto>> GetAllAsync()
    {
        var lichKhoiHanhs = await _lichKhoiHanhRepository.GetAllAsync();
        return lichKhoiHanhs.Select(MapAdminResponse).ToList();
    }

    public async Task<LichKhoiHanhAdminResponseDto> GetByIdAsync(long id)
    {
        var lichKhoiHanh = await _lichKhoiHanhRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Lịch khởi hành không tồn tại.");

        return MapAdminResponse(lichKhoiHanh);
    }

    public async Task<List<LichKhoiHanhAdminResponseDto>> GetByTourIdAsync(long tourId)
    {
        await EnsureTourExistsAsync(tourId);

        var lichKhoiHanhs = await _lichKhoiHanhRepository.GetByTourIdAsync(tourId);
        return lichKhoiHanhs.Select(MapAdminResponse).ToList();
    }

    public async Task<List<LichKhoiHanhResponseDto>> GetVisibleByTourIdAsync(long tourId)
    {
        var tour = await _tourRepository.GetVisibleByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        var lichKhoiHanhs = await _lichKhoiHanhRepository.GetVisibleByTourIdAsync(tour.Id);
        return lichKhoiHanhs.Select(MapPublicResponse).ToList();
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

        return MapAdminResponse(lichKhoiHanh);
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

        return MapAdminResponse(lichKhoiHanh);
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

    private static LichKhoiHanhAdminResponseDto MapAdminResponse(LichKhoiHanh lichKhoiHanh)
    {
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
            GhiChu = lichKhoiHanh.GhiChu,
            LyDoHuy = lichKhoiHanh.LyDoHuy,
            TrangThai = lichKhoiHanh.TrangThai.ToString(),
            CreatedAt = lichKhoiHanh.CreatedAt,
            UpdatedAt = lichKhoiHanh.UpdatedAt
        };
    }

    private static LichKhoiHanhResponseDto MapPublicResponse(LichKhoiHanh lichKhoiHanh)
    {
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
            TrangThai = lichKhoiHanh.TrangThai.ToString()
        };
    }
}
