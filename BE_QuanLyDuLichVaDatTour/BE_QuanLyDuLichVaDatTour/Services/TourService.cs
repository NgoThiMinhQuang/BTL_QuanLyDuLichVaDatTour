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
        return await MapPublicResponsesAsync(tours);
    }

    public async Task<List<TourResponseDto>> SearchVisibleAsync(SearchTourRequestDto request)
    {
        ValidateSearchPriceRange(request.MinPrice, request.MaxPrice);
        ValidateSearchDurationRange(request.MinSoNgay, request.MaxSoNgay);
        ValidateSearchRating(request.MinRating);

        var tours = await _tourRepository.SearchVisibleAsync(
            NormalizeOptionalValue(request.Keyword),
            request.DiemXuatPhatId,
            request.LoaiTourIds,
            request.PhuongTiens?.Where(x => !string.IsNullOrWhiteSpace(x)).Select(x => x.Trim()).ToList(),
            request.MinPrice,
            request.MaxPrice,
            request.MinSoNgay,
            request.MaxSoNgay);

        var results = await MapPublicResponsesAsync(tours);

        if (request.MinRating.HasValue)
        {
            results = results.Where(x => x.AverageRating >= request.MinRating.Value).ToList();
        }

        return results;
    }

    public async Task<TourResponseDto> GetVisibleByIdAsync(long id)
    {
        var tour = await _tourRepository.GetVisibleByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        return (await MapPublicResponsesAsync(new List<Tour> { tour })).Single();
    }

    public async Task<List<AnhTourResponseDto>> GetVisibleImagesByTourIdAsync(long id)
    {
        var tour = await _tourRepository.GetVisibleByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        return tour.AnhTours
            .OrderBy(x => x.ThuTu)
            .Select(MapAnhTourResponse)
            .ToList();
    }

    public async Task<AnhTourResponseDto?> GetVisibleThumbnailByTourIdAsync(long id)
    {
        var tour = await _tourRepository.GetVisibleByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        var orderedImages = tour.AnhTours
            .OrderBy(x => x.ThuTu)
            .ToList();

        var thumbnail = orderedImages.FirstOrDefault(x => x.IsAvatar)
            ?? orderedImages.FirstOrDefault();

        return thumbnail is null ? null : MapAnhTourResponse(thumbnail);
    }

    public async Task<List<TourAdminResponseDto>> GetAllAsync()
    {
        var tours = await _tourRepository.GetAllAsync();
        return tours.Select(MapAdminResponse).ToList();
    }

    private async Task<List<TourResponseDto>> MapPublicResponsesAsync(List<Tour> tours)
    {
        if (tours.Count == 0) return new List<TourResponseDto>();

        var tourIds = tours.Select(t => t.Id).ToList();
        var reviewStats = await LoadReviewStatsAsync(tourIds);
        var departureSummaries = await LoadDepartureSummaryAsync(tourIds);

        return tours.Select(tour =>
        {
            var dto = MapPublicResponse(tour, reviewStats);
            if (departureSummaries.TryGetValue(tour.Id, out var summary))
            {
                dto.SoChoConLai = summary.MinRemainingSeats;
                dto.NgayKhoiHanhGanNhat = summary.NextDepartureDate;
                dto.GiaThapNhat = summary.LowestPrice;
            }
            return dto;
        }).ToList();
    }

    private async Task<Dictionary<long, (decimal AverageRating, int TotalReviews)>> LoadReviewStatsAsync(List<long> tourIds)
    {
        if (tourIds.Count == 0)
        {
            return new Dictionary<long, (decimal AverageRating, int TotalReviews)>();
        }

        var reviewGroups = await _dbContext.DanhGias
            .AsNoTracking()
            .Where(review => review.TourId != 0 && tourIds.Contains(review.TourId) && review.TrangThai == "hien_thi")
            .GroupBy(review => review.TourId)
            .Select(group => new
            {
                TourId = group.Key,
                AverageRating = group.Average(review => (decimal)review.SoSao),
                TotalReviews = group.Count(),
            })
            .ToListAsync();

        return reviewGroups.ToDictionary(
            item => item.TourId,
            item => (Math.Round(item.AverageRating, 1), item.TotalReviews));
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

    public async Task<TourDiemDenResponseDto> AddDiemDenAsync(long tourId, AddTourDiemDenRequestDto request)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        var diaDiem = await _dbContext.DiaDiems
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == request.DiaDiemId)
            ?? throw new KeyNotFoundException("Điểm đến không tồn tại.");

        var maxThuTu = tour.TourDiemDens.Count == 0
            ? (short)0
            : tour.TourDiemDens.Max(x => x.ThuTu);

        var tourDiemDen = new TourDiemDen
        {
            TourId = tourId,
            DiaDiemId = request.DiaDiemId,
            ThuTu = checked((short)(maxThuTu + 1)),
            GhiChu = string.IsNullOrWhiteSpace(request.GhiChu) ? null : request.GhiChu.Trim(),
            DiaDiem = diaDiem,
            CreatedAt = DateTime.UtcNow
        };

        tour.TourDiemDens.Add(tourDiemDen);
        tour.UpdatedAt = DateTime.UtcNow;
        await _tourRepository.SaveChangesAsync();

        return MapTourDiemDenResponse(tourDiemDen);
    }

    public async Task DeleteDiemDenAsync(long tourDiemDenId)
    {
        var tourDiemDen = await _dbContext.TourDiemDens
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.Id == tourDiemDenId)
            ?? throw new KeyNotFoundException("Điểm đến không tồn tại.");

        var tour = tourDiemDen.Tour!;
        tour.UpdatedAt = DateTime.UtcNow;
        _dbContext.TourDiemDens.Remove(tourDiemDen);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<TourDiemDenResponseDto> UpdateDiemDenAsync(long tourDiemDenId, UpdateTourDiemDenRequestDto request)
    {
        var tourDiemDen = await _dbContext.TourDiemDens
            .Include(x => x.DiaDiem)
            .FirstOrDefaultAsync(x => x.Id == tourDiemDenId)
            ?? throw new KeyNotFoundException("Điểm đến không tồn tại.");

        tourDiemDen.GhiChu = string.IsNullOrWhiteSpace(request.GhiChu) ? null : request.GhiChu.Trim();

        await _dbContext.SaveChangesAsync();

        return MapTourDiemDenResponse(tourDiemDen);
    }

    public async Task<List<TourDiemDenResponseDto>> ReorderDiemDensAsync(long tourId, List<long> diemDenIds)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        var diemDenLookup = tour.TourDiemDens.ToDictionary(x => x.Id);

        if (diemDenIds.Count != tour.TourDiemDens.Count)
        {
            throw new InvalidOperationException("Danh sách điểm đến không khớp với số lượng hiện tại.");
        }

        for (var i = 0; i < diemDenIds.Count; i++)
        {
            if (!diemDenLookup.TryGetValue(diemDenIds[i], out var diemDen))
            {
                throw new KeyNotFoundException($"Điểm đến ID {diemDenIds[i]} không thuộc tour này.");
            }

            diemDen.ThuTu = checked((short)(i + 1));
        }

        tour.UpdatedAt = DateTime.UtcNow;
        await _tourRepository.SaveChangesAsync();

        return tour.TourDiemDens
            .OrderBy(x => x.ThuTu)
            .Select(MapTourDiemDenResponse)
            .ToList();
    }

    public async Task<AnhTourResponseDto> AddAnhTourAsync(long tourId, AddAnhTourRequestDto request)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        var linkAnh = request.LinkAnh.Trim();
        if (string.IsNullOrWhiteSpace(linkAnh))
        {
            throw new InvalidOperationException("Link ảnh không được để trống.");
        }

        var maxThuTu = tour.AnhTours.Count == 0
            ? (short)0
            : tour.AnhTours.Max(x => x.ThuTu);

        var isFirst = tour.AnhTours.Count == 0;
        var now = DateTime.UtcNow;
        var anhTour = new AnhTour
        {
            TourId = tourId,
            LinkAnh = linkAnh,
            MoTa = string.IsNullOrWhiteSpace(request.MoTa) ? null : request.MoTa.Trim(),
            ThuTu = checked((short)(maxThuTu + 1)),
            IsAvatar = isFirst,
            CreatedAt = now,
            UpdatedAt = now
        };

        tour.AnhTours.Add(anhTour);
        tour.UpdatedAt = now;
        await _tourRepository.SaveChangesAsync();

        return MapAnhTourResponse(anhTour);
    }

    public async Task<AnhTourResponseDto> UpdateAnhTourAsync(long anhTourId, UpdateAnhTourRequestDto request)
    {
        var anhTour = await _dbContext.AnhTours.FindAsync(anhTourId)
            ?? throw new KeyNotFoundException("Ảnh tour không tồn tại.");

        anhTour.MoTa = string.IsNullOrWhiteSpace(request.MoTa) ? null : request.MoTa.Trim();
        anhTour.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();

        return MapAnhTourResponse(anhTour);
    }

    public async Task DeleteAnhTourAsync(long anhTourId)
    {
        var anhTour = await _dbContext.AnhTours
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.Id == anhTourId)
            ?? throw new KeyNotFoundException("Ảnh tour không tồn tại.");

        var tour = anhTour.Tour!;
        tour.UpdatedAt = DateTime.UtcNow;
        _dbContext.AnhTours.Remove(anhTour);

        if (anhTour.IsAvatar && tour.AnhTours.Count > 1)
        {
            var newAvatar = tour.AnhTours
                .Where(x => x.Id != anhTourId)
                .OrderBy(x => x.ThuTu)
                .First();
            newAvatar.IsAvatar = true;
        }

        await _dbContext.SaveChangesAsync();
    }

    public async Task<AnhTourResponseDto> SetAvatarAsync(long anhTourId)
    {
        var anhTour = await _dbContext.AnhTours
            .Include(x => x.Tour).ThenInclude(t => t.AnhTours)
            .FirstOrDefaultAsync(x => x.Id == anhTourId)
            ?? throw new KeyNotFoundException("Ảnh tour không tồn tại.");

        var tour = anhTour.Tour!;

        // Tắt IsAvatar của ảnh đại diện hiện tại
        var currentAvatar = tour.AnhTours.FirstOrDefault(x => x.IsAvatar);
        if (currentAvatar is not null && currentAvatar.Id != anhTourId)
        {
            currentAvatar.IsAvatar = false;
            currentAvatar.UpdatedAt = DateTime.UtcNow;
        }

        // Đặt ảnh mới làm đại diện
        anhTour.IsAvatar = true;
        anhTour.UpdatedAt = DateTime.UtcNow;
        tour.UpdatedAt = DateTime.UtcNow;

        await _dbContext.SaveChangesAsync();

        return MapAnhTourResponse(anhTour);
    }

    public async Task<List<AnhTourResponseDto>> ReorderAnhToursAsync(long tourId, List<long> anhTourIds)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(tourId)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        var anhTourLookup = tour.AnhTours.ToDictionary(x => x.Id);

        if (anhTourIds.Count != tour.AnhTours.Count)
        {
            throw new InvalidOperationException("Danh sách ảnh không khớp với số lượng hiện tại.");
        }

        for (var i = 0; i < anhTourIds.Count; i++)
        {
            if (!anhTourLookup.TryGetValue(anhTourIds[i], out var anhTour))
            {
                throw new KeyNotFoundException($"Ảnh tour ID {anhTourIds[i]} không thuộc tour này.");
            }

            anhTour.ThuTu = checked((short)(i + 1));
            anhTour.UpdatedAt = DateTime.UtcNow;
        }

        tour.UpdatedAt = DateTime.UtcNow;
        await _tourRepository.SaveChangesAsync();

        return tour.AnhTours
            .OrderBy(x => x.ThuTu)
            .Select(MapAnhTourResponse)
            .ToList();
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

    private static void ValidateSearchRating(int? minRating)
    {
        if (minRating.HasValue && (minRating.Value < 1 || minRating.Value > 5))
        {
            throw new InvalidOperationException("Đánh giá sao không hợp lệ (1-5).");
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

    private async Task<Dictionary<long, (int MinRemainingSeats, DateTime? NextDepartureDate, decimal LowestPrice)>> LoadDepartureSummaryAsync(List<long> tourIds)
    {
        var today = DateTime.UtcNow.Date;

        var lichKhoiHanhs = await _dbContext.LichKhoiHanhs
            .AsNoTracking()
            .Where(lkh => tourIds.Contains(lkh.TourId) && lkh.TrangThai == TrangThaiLichKhoiHanh.mo_ban)
            .ToListAsync();

        var lkhIds = lichKhoiHanhs.Select(lkh => lkh.Id).ToList();

        var bookedSeatsLookup = new Dictionary<long, int>();
        if (lkhIds.Count > 0)
        {
            var bookings = await _dbContext.Bookings
                .AsNoTracking()
                .Where(b => lkhIds.Contains(b.LichKhoiHanhId) && b.TrangThaiBooking != TrangThaiBooking.da_huy)
                .Select(b => new { b.LichKhoiHanhId, b.SoNguoiLon, b.SoTreEm, b.SoEmBe })
                .ToListAsync();

            bookedSeatsLookup = bookings
                .GroupBy(b => b.LichKhoiHanhId)
                .ToDictionary(g => g.Key, g => g.Sum(b => (int)b.SoNguoiLon + (int)b.SoTreEm + (int)b.SoEmBe));
        }

        var bangGiaLowestPrice = new Dictionary<long, decimal>();
        if (lkhIds.Count > 0)
        {
            var prices = await _dbContext.BangGiaLichKhoiHanhs
                .AsNoTracking()
                .Where(bg => lkhIds.Contains(bg.LichKhoiHanhId) && bg.LoaiKhach == LoaiKhach.nguoi_lon && bg.LoaiGia == LoaiGiaApDung.ngay_thuong)
                .GroupBy(bg => bg.LichKhoiHanhId)
                .Select(g => new { LichKhoiHanhId = g.Key, MinPrice = g.Min(bg => bg.DonGia) })
                .ToListAsync();

            foreach (var priceItem in prices)
            {
                bangGiaLowestPrice[priceItem.LichKhoiHanhId] = priceItem.MinPrice;
            }
        }

        var result = new Dictionary<long, (int, DateTime?, decimal)>();

        foreach (var tourId in tourIds)
        {
            var tourDepartures = lichKhoiHanhs.Where(d => d.TourId == tourId).ToList();

            if (tourDepartures.Count == 0)
            {
                result[tourId] = (0, null, 0m);
                continue;
            }

            var minRemainingSeats = tourDepartures.Min(d =>
            {
                var booked = bookedSeatsLookup.GetValueOrDefault(d.Id, 0);
                return Math.Max(d.SoChoToiDa - booked, 0);
            });

            var nextDeparture = tourDepartures
                .Where(d => d.NgayKhoiHanh.Date >= today)
                .OrderBy(d => d.NgayKhoiHanh)
                .Select(d => (DateTime?)d.NgayKhoiHanh)
                .FirstOrDefault();

            var lowestPrice = tourDepartures
                .Select(d => bangGiaLowestPrice.GetValueOrDefault(d.Id, 0m))
                .Where(price => price > 0)
                .DefaultIfEmpty(0m)
                .Min();

            result[tourId] = (minRemainingSeats, nextDeparture, lowestPrice);
        }

        return result;
    }

    private static TourResponseDto MapPublicResponse(Tour tour, IReadOnlyDictionary<long, (decimal AverageRating, int TotalReviews)> reviewStats)
    {
        var stats = reviewStats.TryGetValue(tour.Id, out var value)
            ? value
            : (AverageRating: 0m, TotalReviews: 0);

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
            MoTaChiTiet = tour.MoTaChiTiet,
            DieuKienTour = tour.DieuKienTour,
            GiaTuThamKhao = tour.GiaTuThamKhao,
            AverageRating = stats.AverageRating,
            TotalReviews = stats.TotalReviews,
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
