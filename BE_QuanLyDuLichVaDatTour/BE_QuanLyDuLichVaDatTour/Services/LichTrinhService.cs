using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.LichTrinh;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class LichTrinhService : ILichTrinhService
{
    private readonly ILichTrinhRepository _lichTrinhRepository;
    private readonly ITourRepository _tourRepository;
    private readonly AppDbContext _dbContext;

    public LichTrinhService(
        ILichTrinhRepository lichTrinhRepository,
        ITourRepository tourRepository,
        AppDbContext dbContext)
    {
        _lichTrinhRepository = lichTrinhRepository;
        _tourRepository = tourRepository;
        _dbContext = dbContext;
    }

    public async Task<List<LichTrinhAdminResponseDto>> GetAllAsync()
    {
        var lichTrinhs = await _lichTrinhRepository.GetAllAsync();
        return lichTrinhs.Select(MapAdminResponse).ToList();
    }

    public async Task<LichTrinhAdminResponseDto> GetByIdAsync(long id)
    {
        var lichTrinh = await _lichTrinhRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Lịch trình không tồn tại.");

        return MapAdminResponse(lichTrinh);
    }

    public async Task<List<LichTrinhAdminResponseDto>> GetByTourIdAsync(long tourId)
    {
        await EnsureTourExistsAsync(tourId);

        var lichTrinhs = await _lichTrinhRepository.GetByTourIdAsync(tourId);
        return lichTrinhs.Select(MapAdminResponse).ToList();
    }

    public async Task<List<LichTrinhResponseDto>> GetVisibleByTourIdAsync(long tourId)
    {
        var tour = await _tourRepository.GetVisibleByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        var lichTrinhs = await _lichTrinhRepository.GetVisibleByTourIdAsync(tour.Id);
        return lichTrinhs.Select(MapPublicResponse).ToList();
    }

    public async Task<LichTrinhAdminResponseDto> CreateAsync(CreateLichTrinhRequestDto request)
    {
        var tour = await EnsureTourExistsAsync(request.TourId);
        var diaDiem = await EnsureDiaDiemExistsAsync(request.DiaDiemId);

        ValidateNgayThu(request.NgayThu, tour.SoNgay);
        ValidateThuTuTrongNgay(request.ThuTuTrongNgay);
        ValidateTimeRange(request.GioBatDau, request.GioKetThuc);

        var tieuDe = NormalizeOptionalValue(request.TieuDe);
        var noiDung = NormalizeOptionalValue(request.NoiDung);
        ValidateContent(tieuDe, noiDung);

        await EnsureUniquePositionAsync(request.TourId, request.NgayThu, request.ThuTuTrongNgay);

        var now = DateTime.UtcNow;
        var lichTrinh = new LichTrinh
        {
            TourId = tour.Id,
            NgayThu = checked((byte)request.NgayThu),
            ThuTuTrongNgay = checked((short)request.ThuTuTrongNgay),
            GioBatDau = request.GioBatDau,
            GioKetThuc = request.GioKetThuc,
            TieuDe = tieuDe,
            NoiDung = noiDung,
            DiaDiemId = diaDiem?.Id,
            CreatedAt = now,
            UpdatedAt = now,
            Tour = tour,
            DiaDiem = diaDiem
        };

        await _lichTrinhRepository.AddAsync(lichTrinh);
        await _lichTrinhRepository.SaveChangesAsync();

        return MapAdminResponse(lichTrinh);
    }

    public async Task<LichTrinhAdminResponseDto> UpdateAsync(long id, UpdateLichTrinhRequestDto request)
    {
        var lichTrinh = await _lichTrinhRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Lịch trình không tồn tại.");

        var tour = await EnsureTourExistsAsync(request.TourId);
        var diaDiem = await EnsureDiaDiemExistsAsync(request.DiaDiemId);

        ValidateNgayThu(request.NgayThu, tour.SoNgay);
        ValidateThuTuTrongNgay(request.ThuTuTrongNgay);
        ValidateTimeRange(request.GioBatDau, request.GioKetThuc);

        var tieuDe = NormalizeOptionalValue(request.TieuDe);
        var noiDung = NormalizeOptionalValue(request.NoiDung);
        ValidateContent(tieuDe, noiDung);

        await EnsureUniquePositionAsync(request.TourId, request.NgayThu, request.ThuTuTrongNgay, id);

        lichTrinh.TourId = tour.Id;
        lichTrinh.NgayThu = checked((byte)request.NgayThu);
        lichTrinh.ThuTuTrongNgay = checked((short)request.ThuTuTrongNgay);
        lichTrinh.GioBatDau = request.GioBatDau;
        lichTrinh.GioKetThuc = request.GioKetThuc;
        lichTrinh.TieuDe = tieuDe;
        lichTrinh.NoiDung = noiDung;
        lichTrinh.DiaDiemId = diaDiem?.Id;
        lichTrinh.UpdatedAt = DateTime.UtcNow;
        lichTrinh.Tour = tour;
        lichTrinh.DiaDiem = diaDiem;

        await _lichTrinhRepository.SaveChangesAsync();

        return MapAdminResponse(lichTrinh);
    }

    public async Task DeleteAsync(long id)
    {
        var lichTrinh = await _lichTrinhRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Lịch trình không tồn tại.");

        _lichTrinhRepository.Delete(lichTrinh);
        await _lichTrinhRepository.SaveChangesAsync();
    }

    private async Task<Tour> EnsureTourExistsAsync(long tourId)
    {
        return await _tourRepository.GetByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");
    }

    private async Task<DiaDiem?> EnsureDiaDiemExistsAsync(long? diaDiemId)
    {
        if (!diaDiemId.HasValue)
        {
            return null;
        }

        return await _dbContext.DiaDiems
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == diaDiemId.Value)
            ?? throw new KeyNotFoundException("Địa điểm không tồn tại.");
    }

    private async Task EnsureUniquePositionAsync(long tourId, int ngayThu, int thuTuTrongNgay, long? currentId = null)
    {
        var existing = await _lichTrinhRepository.GetByTourDayOrderAsync(tourId, ngayThu, thuTuTrongNgay);
        if (existing is not null && existing.Id != currentId)
        {
            throw new InvalidOperationException("Thứ tự lịch trình trong ngày đã tồn tại.");
        }
    }

    private static void ValidateNgayThu(int ngayThu, int soNgayTour)
    {
        if (ngayThu < 1)
        {
            throw new InvalidOperationException("Ngày thứ phải lớn hơn hoặc bằng 1.");
        }

        if (ngayThu > soNgayTour)
        {
            throw new InvalidOperationException("Ngày thứ không được vượt quá số ngày của tour.");
        }
    }

    private static void ValidateThuTuTrongNgay(int thuTuTrongNgay)
    {
        if (thuTuTrongNgay < 1)
        {
            throw new InvalidOperationException("Thứ tự trong ngày phải lớn hơn hoặc bằng 1.");
        }
    }

    private static void ValidateTimeRange(TimeSpan? gioBatDau, TimeSpan? gioKetThuc)
    {
        if (gioBatDau.HasValue && gioKetThuc.HasValue && gioKetThuc.Value < gioBatDau.Value)
        {
            throw new InvalidOperationException("Giờ kết thúc không được nhỏ hơn giờ bắt đầu.");
        }
    }

    private static void ValidateContent(string? tieuDe, string? noiDung)
    {
        if (string.IsNullOrWhiteSpace(tieuDe) && string.IsNullOrWhiteSpace(noiDung))
        {
            throw new InvalidOperationException("Lịch trình phải có tiêu đề hoặc nội dung.");
        }
    }

    private static string? NormalizeOptionalValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }

    private static LichTrinhAdminResponseDto MapAdminResponse(LichTrinh lichTrinh)
    {
        return new LichTrinhAdminResponseDto
        {
            Id = lichTrinh.Id,
            TourId = lichTrinh.TourId,
            TenTour = lichTrinh.Tour?.TenTour ?? string.Empty,
            NgayThu = lichTrinh.NgayThu,
            ThuTuTrongNgay = lichTrinh.ThuTuTrongNgay,
            GioBatDau = lichTrinh.GioBatDau,
            GioKetThuc = lichTrinh.GioKetThuc,
            TieuDe = lichTrinh.TieuDe,
            NoiDung = lichTrinh.NoiDung,
            DiaDiemId = lichTrinh.DiaDiemId,
            TenDiaDiem = lichTrinh.DiaDiem?.TenDiaDiem,
            CreatedAt = lichTrinh.CreatedAt,
            UpdatedAt = lichTrinh.UpdatedAt
        };
    }

    private static LichTrinhResponseDto MapPublicResponse(LichTrinh lichTrinh)
    {
        return new LichTrinhResponseDto
        {
            Id = lichTrinh.Id,
            TourId = lichTrinh.TourId,
            NgayThu = lichTrinh.NgayThu,
            ThuTuTrongNgay = lichTrinh.ThuTuTrongNgay,
            GioBatDau = lichTrinh.GioBatDau,
            GioKetThuc = lichTrinh.GioKetThuc,
            TieuDe = lichTrinh.TieuDe,
            NoiDung = lichTrinh.NoiDung,
            DiaDiemId = lichTrinh.DiaDiemId,
            TenDiaDiem = lichTrinh.DiaDiem?.TenDiaDiem
        };
    }
}
