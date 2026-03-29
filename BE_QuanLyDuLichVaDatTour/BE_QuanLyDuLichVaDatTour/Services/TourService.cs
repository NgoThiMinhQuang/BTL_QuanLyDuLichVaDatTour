using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.DTOs.Tour;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class TourService : ITourService
{
    private readonly ITourRepository _tourRepository;
    private readonly ILoaiTourRepository _loaiTourRepository;
    private readonly AppDbContext _dbContext;

    public TourService(
        ITourRepository tourRepository,
        ILoaiTourRepository loaiTourRepository,
        AppDbContext dbContext)
    {
        _tourRepository = tourRepository;
        _loaiTourRepository = loaiTourRepository;
        _dbContext = dbContext;
    }

    public async Task<List<TourResponseDto>> GetVisibleAsync()
    {
        var tours = await _tourRepository.GetVisibleAsync();
        return tours.Select(MapPublicResponse).ToList();
    }

    public async Task<List<TourResponseDto>> SearchVisibleAsync(SearchTourRequestDto request)
    {
        ValidateSearchPriceRange(request.MinPrice, request.MaxPrice);
        ValidateSearchDurationRange(request.MinSoNgay, request.MaxSoNgay);

        var tours = await _tourRepository.SearchVisibleAsync(
            NormalizeOptionalValue(request.Keyword),
            request.DiemXuatPhatId,
            request.LoaiTourIds,
            request.PhuongTiens?.Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => x.Trim()).ToList(),
            request.MinPrice,
            request.MaxPrice,
            request.MinSoNgay,
            request.MaxSoNgay);

        return tours.Select(MapPublicResponse).ToList();
    }

    public async Task<TourResponseDto> GetVisibleByIdAsync(long id)
    {
        var tour = await _tourRepository.GetVisibleByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        return MapPublicResponse(tour);
    }

    public async Task<List<TourAdminResponseDto>> GetAllAsync()
    {
        var tours = await _tourRepository.GetAllAsync();
        return tours.Select(MapAdminResponse).ToList();
    }

    public async Task<TourAdminResponseDto> GetByIdAsync(long id)
    {
        var tour = await _tourRepository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        return MapAdminResponse(tour);
    }

    public async Task<TourAdminResponseDto> CreateAsync(CreateTourRequestDto request)
    {
        var maTour = NormalizeRequiredValue(request.MaTour, "Mã tour không được để trống.");
        var tenTour = NormalizeRequiredValue(request.TenTour, "Tên tour không được để trống.");

        ValidateDuration(request.SoNgay, request.SoDem);
        ValidatePrice(request.GiaTuThamKhao, "Giá từ tham khảo không hợp lệ.");

        await EnsureMaTourIsUniqueAsync(maTour);
        var loaiTour = await EnsureLoaiTourExistsAsync(request.LoaiTourId);
        var diemXuatPhat = await EnsureDiaDiemExistsAsync(request.DiemXuatPhatId, "Điểm xuất phát không tồn tại.");
        var diemDens = await BuildTourDiemDensAsync(request.DiemDenIds);
        var anhTours = BuildAnhTours(request.AnhTours);

        var now = DateTime.UtcNow;
        var tour = new Tour
        {
            MaTour = maTour,
            TenTour = tenTour,
            LoaiTourId = loaiTour.Id,
            DiemXuatPhatId = diemXuatPhat.Id,
            SoNgay = checked((byte)request.SoNgay),
            SoDem = checked((byte)request.SoDem),
            PhuongTien = NormalizeOptionalValue(request.PhuongTien),
            GiaTuThamKhao = request.GiaTuThamKhao,
            MoTaNgan = NormalizeOptionalValue(request.MoTaNgan),
            MoTaChiTiet = NormalizeOptionalValue(request.MoTaChiTiet),
            DieuKienTour = NormalizeOptionalValue(request.DieuKienTour),
            IsNoiBat = request.IsNoiBat,
            TrangThai = request.TrangThai ?? TrangThaiTour.nhap,
            CreatedAt = now,
            UpdatedAt = now,
            LoaiTour = loaiTour,
            DiemXuatPhat = diemXuatPhat,
            TourDiemDens = diemDens,
            AnhTours = anhTours
        };

        await _tourRepository.AddAsync(tour);
        await _tourRepository.SaveChangesAsync();

        var createdTour = await _tourRepository.GetByIdAsync(tour.Id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        return MapAdminResponse(createdTour);
    }

    public async Task<TourAdminResponseDto> UpdateAsync(long id, UpdateTourRequestDto request)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        var maTour = NormalizeRequiredValue(request.MaTour, "Mã tour không được để trống.");
        var tenTour = NormalizeRequiredValue(request.TenTour, "Tên tour không được để trống.");

        ValidateDuration(request.SoNgay, request.SoDem);
        ValidatePrice(request.GiaTuThamKhao, "Giá từ tham khảo không hợp lệ.");

        await EnsureMaTourIsUniqueAsync(maTour, id);
        var loaiTour = await EnsureLoaiTourExistsAsync(request.LoaiTourId);
        var diemXuatPhat = await EnsureDiaDiemExistsAsync(request.DiemXuatPhatId, "Điểm xuất phát không tồn tại.");
        var diemDens = await BuildTourDiemDensAsync(request.DiemDenIds);
        var anhTours = BuildAnhTours(request.AnhTours);

        tour.MaTour = maTour;
        tour.TenTour = tenTour;
        tour.LoaiTourId = loaiTour.Id;
        tour.DiemXuatPhatId = diemXuatPhat.Id;
        tour.SoNgay = checked((byte)request.SoNgay);
        tour.SoDem = checked((byte)request.SoDem);
        tour.PhuongTien = NormalizeOptionalValue(request.PhuongTien);
        tour.GiaTuThamKhao = request.GiaTuThamKhao;
        tour.MoTaNgan = NormalizeOptionalValue(request.MoTaNgan);
        tour.MoTaChiTiet = NormalizeOptionalValue(request.MoTaChiTiet);
        tour.DieuKienTour = NormalizeOptionalValue(request.DieuKienTour);
        tour.IsNoiBat = request.IsNoiBat;
        tour.TrangThai = request.TrangThai;
        tour.UpdatedAt = DateTime.UtcNow;
        tour.LoaiTour = loaiTour;
        tour.DiemXuatPhat = diemXuatPhat;

        _dbContext.TourDiemDens.RemoveRange(tour.TourDiemDens);
        _dbContext.AnhTours.RemoveRange(tour.AnhTours);
        tour.TourDiemDens = diemDens;
        tour.AnhTours = anhTours;

        await _tourRepository.SaveChangesAsync();

        var updatedTour = await _tourRepository.GetByIdAsync(tour.Id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        return MapAdminResponse(updatedTour);
    }

    public async Task UpdateStatusAsync(long id, UpdateTourStatusRequestDto request)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        tour.TrangThai = request.TrangThai;
        tour.UpdatedAt = DateTime.UtcNow;

        await _tourRepository.SaveChangesAsync();
    }

    public async Task HideAsync(long id)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        tour.TrangThai = TrangThaiTour.an;
        tour.UpdatedAt = DateTime.UtcNow;

        await _tourRepository.SaveChangesAsync();
    }

    private async Task EnsureMaTourIsUniqueAsync(string maTour, long? currentId = null)
    {
        var existingTour = await _tourRepository.GetByMaTourAsync(maTour);
        if (existingTour is not null && existingTour.Id != currentId)
        {
            throw new InvalidOperationException("Mã tour đã tồn tại.");
        }
    }

    private async Task<LoaiTour> EnsureLoaiTourExistsAsync(long loaiTourId)
    {
        return await _loaiTourRepository.GetByIdAsync(loaiTourId)
            ?? throw new KeyNotFoundException("Loại tour không tồn tại.");
    }

    private async Task<DiaDiem> EnsureDiaDiemExistsAsync(long diaDiemId, string errorMessage)
    {
        return await _dbContext.DiaDiems
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == diaDiemId)
            ?? throw new KeyNotFoundException(errorMessage);
    }

    private async Task<List<TourDiemDen>> BuildTourDiemDensAsync(List<long>? diemDenIds)
    {
        if (diemDenIds is null || diemDenIds.Count == 0)
        {
            return new List<TourDiemDen>();
        }

        var normalizedIds = diemDenIds.Distinct().ToList();
        var diaDiemLookup = await _dbContext.DiaDiems
            .AsNoTracking()
            .Where(x => normalizedIds.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id);

        if (diaDiemLookup.Count != normalizedIds.Count)
        {
            throw new KeyNotFoundException("Một hoặc nhiều điểm đến không tồn tại.");
        }

        var result = new List<TourDiemDen>();
        for (var index = 0; index < diemDenIds.Count; index++)
        {
            var diaDiemId = diemDenIds[index];
            var diaDiem = diaDiemLookup[diaDiemId];
            result.Add(new TourDiemDen
            {
                DiaDiemId = diaDiemId,
                ThuTu = checked((short)(index + 1)),
                DiaDiem = diaDiem,
                CreatedAt = DateTime.UtcNow
            });
        }

        return result;
    }

    private static List<AnhTour> BuildAnhTours(List<string>? anhTours)
    {
        if (anhTours is null || anhTours.Count == 0)
        {
            return new List<AnhTour>();
        }

        var now = DateTime.UtcNow;
        var result = new List<AnhTour>();
        var avatarAssigned = false;

        for (var index = 0; index < anhTours.Count; index++)
        {
            var linkAnh = NormalizeRequiredValue(anhTours[index], "Link ảnh tour không được để trống.");
            result.Add(new AnhTour
            {
                LinkAnh = linkAnh,
                ThuTu = checked((short)(index + 1)),
                IsAvatar = !avatarAssigned,
                CreatedAt = now,
                UpdatedAt = now
            });
            avatarAssigned = true;
        }

        return result;
    }

    private static void ValidateDuration(int soNgay, int soDem)
    {
        if (soNgay <= 0)
        {
            throw new InvalidOperationException("Số ngày phải lớn hơn 0.");
        }

        if (soDem > soNgay)
        {
            throw new InvalidOperationException("Số đêm không được lớn hơn số ngày.");
        }
    }

    private static void ValidatePrice(decimal value, string errorMessage)
    {
        if (value < 0)
        {
            throw new InvalidOperationException(errorMessage);
        }
    }

    private static void ValidateSearchPriceRange(decimal? minPrice, decimal? maxPrice)
    {
        if (minPrice is < 0 || maxPrice is < 0)
        {
            throw new InvalidOperationException("Khoảng giá không hợp lệ.");
        }

        if (minPrice.HasValue && maxPrice.HasValue && minPrice > maxPrice)
        {
            throw new InvalidOperationException("Giá nhỏ nhất không được lớn hơn giá lớn nhất.");
        }
    }

    private static void ValidateSearchDurationRange(int? minSoNgay, int? maxSoNgay)
    {
        if (minSoNgay is 0 || maxSoNgay is 0)
        {
            throw new InvalidOperationException("Số ngày phải lớn hơn 0.");
        }

        if (minSoNgay.HasValue && maxSoNgay.HasValue && minSoNgay > maxSoNgay)
        {
            throw new InvalidOperationException("Số ngày tối thiểu không được lớn hơn số ngày tối đa.");
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

    private static TourResponseDto MapPublicResponse(Tour tour)
    {
        return new TourResponseDto
        {
            Id = tour.Id,
            MaTour = tour.MaTour,
            TenTour = tour.TenTour,
            LoaiTourId = tour.LoaiTourId,
            TenLoaiTour = tour.LoaiTour?.Ten ?? string.Empty,
            DiemXuatPhatId = tour.DiemXuatPhatId,
            TenDiemXuatPhat = tour.DiemXuatPhat?.TenDiaDiem ?? string.Empty,
            SoNgay = tour.SoNgay,
            SoDem = tour.SoDem,
            PhuongTien = tour.PhuongTien,
            MoTaNgan = tour.MoTaNgan,
            GiaTuThamKhao = tour.GiaTuThamKhao,
            IsNoiBat = tour.IsNoiBat,
            DiemDens = tour.TourDiemDens
                .OrderBy(x => x.ThuTu)
                .Select(MapTourDiemDenResponse)
                .ToList(),
            AnhTours = tour.AnhTours
                .OrderBy(x => x.ThuTu)
                .Select(MapAnhTourResponse)
                .ToList(),
            TrangThai = tour.TrangThai.ToString()
        };
    }

    private static AnhTourResponseDto MapAnhTourResponse(AnhTour anhTour)
    {
        return new AnhTourResponseDto
        {
            Id = anhTour.Id,
            LinkAnh = anhTour.LinkAnh,
            MoTa = anhTour.MoTa,
            IsAvatar = anhTour.IsAvatar,
            ThuTu = anhTour.ThuTu
        };
    }

    private static TourDiemDenResponseDto MapTourDiemDenResponse(TourDiemDen tourDiemDen)
    {
        return new TourDiemDenResponseDto
        {
            Id = tourDiemDen.Id,
            DiaDiemId = tourDiemDen.DiaDiemId,
            TenDiaDiem = tourDiemDen.DiaDiem?.TenDiaDiem ?? string.Empty,
            TinhThanh = tourDiemDen.DiaDiem?.TinhThanh,
            QuocGia = tourDiemDen.DiaDiem?.QuocGia ?? string.Empty,
            ThuTu = tourDiemDen.ThuTu,
            GhiChu = tourDiemDen.GhiChu
        };
    }

    private static TourAdminResponseDto MapAdminResponse(Tour tour)
    {
        return new TourAdminResponseDto
        {
            Id = tour.Id,
            MaTour = tour.MaTour,
            TenTour = tour.TenTour,
            LoaiTourId = tour.LoaiTourId,
            TenLoaiTour = tour.LoaiTour?.Ten ?? string.Empty,
            DiemXuatPhatId = tour.DiemXuatPhatId,
            TenDiemXuatPhat = tour.DiemXuatPhat?.TenDiaDiem ?? string.Empty,
            SoNgay = tour.SoNgay,
            SoDem = tour.SoDem,
            PhuongTien = tour.PhuongTien,
            GiaTuThamKhao = tour.GiaTuThamKhao,
            MoTaNgan = tour.MoTaNgan,
            MoTaChiTiet = tour.MoTaChiTiet,
            DieuKienTour = tour.DieuKienTour,
            IsNoiBat = tour.IsNoiBat,
            DiemDens = tour.TourDiemDens
                .OrderBy(x => x.ThuTu)
                .Select(MapTourDiemDenResponse)
                .ToList(),
            AnhTours = tour.AnhTours
                .OrderBy(x => x.ThuTu)
                .Select(MapAnhTourResponse)
                .ToList(),
            TrangThai = tour.TrangThai.ToString(),
            CreatedAt = tour.CreatedAt,
            UpdatedAt = tour.UpdatedAt
        };
    }
}
