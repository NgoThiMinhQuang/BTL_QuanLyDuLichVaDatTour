using BLL.DTOs.Tour;
using BLL.Interfaces;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;

namespace BLL.Services;

public class TourService : ITourService
{
    private readonly ITourRepository _tourRepository;
    private readonly ILoaiTourRepository _loaiTourRepository;
    private readonly IDiaDiemRepository _diaDiemRepository;

    public TourService(
        ITourRepository tourRepository,
        ILoaiTourRepository loaiTourRepository,
        IDiaDiemRepository diaDiemRepository)
    {
        _tourRepository = tourRepository;
        _loaiTourRepository = loaiTourRepository;
        _diaDiemRepository = diaDiemRepository;
    }

    public async Task<List<TourResponseDto>> GetVisibleAsync()
    {
        var tours = await _tourRepository.GetVisibleAsync();
        return tours.Select(MapPublicResponse).ToList();
    }

    public async Task<TourResponseDto> GetVisibleByIdAsync(ulong id)
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

    public async Task<TourAdminResponseDto> GetByIdAsync(ulong id)
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
        ValidatePrice(request.GiaNguoiLonMacDinh, "Giá người lớn mặc định không hợp lệ.");
        ValidatePrice(request.GiaTreEmMacDinh, "Giá trẻ em mặc định không hợp lệ.");

        await EnsureMaTourIsUniqueAsync(maTour);
        var loaiTour = await EnsureLoaiTourExistsAsync(request.LoaiTourId);
        var diaDiemKhoiHanh = await EnsureDiaDiemExistsAsync(request.DiaDiemKhoiHanhId);

        var now = DateTime.UtcNow;
        var tour = new Tour
        {
            MaTour = maTour,
            TenTour = tenTour,
            LoaiTourId = loaiTour.Id,
            DiaDiemKhoiHanhId = diaDiemKhoiHanh.Id,
            SoNgay = request.SoNgay,
            SoDem = request.SoDem,
            PhuongTien = NormalizeOptionalValue(request.PhuongTien),
            MoTaNgan = NormalizeOptionalValue(request.MoTaNgan),
            MoTaChiTiet = NormalizeOptionalValue(request.MoTaChiTiet),
            DieuKienTour = NormalizeOptionalValue(request.DieuKienTour),
            GiaNguoiLonMacDinh = request.GiaNguoiLonMacDinh,
            GiaTreEmMacDinh = request.GiaTreEmMacDinh,
            TrangThai = request.TrangThai ?? TrangThaiTour.nhap,
            CreatedAt = now,
            UpdatedAt = now,
            LoaiTour = loaiTour,
            DiaDiemKhoiHanh = diaDiemKhoiHanh
        };

        await _tourRepository.AddAsync(tour);
        await _tourRepository.SaveChangesAsync();

        return MapAdminResponse(tour);
    }

    public async Task<TourAdminResponseDto> UpdateAsync(ulong id, UpdateTourRequestDto request)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        var maTour = NormalizeRequiredValue(request.MaTour, "Mã tour không được để trống.");
        var tenTour = NormalizeRequiredValue(request.TenTour, "Tên tour không được để trống.");

        ValidateDuration(request.SoNgay, request.SoDem);
        ValidatePrice(request.GiaNguoiLonMacDinh, "Giá người lớn mặc định không hợp lệ.");
        ValidatePrice(request.GiaTreEmMacDinh, "Giá trẻ em mặc định không hợp lệ.");

        await EnsureMaTourIsUniqueAsync(maTour, id);
        var loaiTour = await EnsureLoaiTourExistsAsync(request.LoaiTourId);
        var diaDiemKhoiHanh = await EnsureDiaDiemExistsAsync(request.DiaDiemKhoiHanhId);

        tour.MaTour = maTour;
        tour.TenTour = tenTour;
        tour.LoaiTourId = loaiTour.Id;
        tour.DiaDiemKhoiHanhId = diaDiemKhoiHanh.Id;
        tour.SoNgay = request.SoNgay;
        tour.SoDem = request.SoDem;
        tour.PhuongTien = NormalizeOptionalValue(request.PhuongTien);
        tour.MoTaNgan = NormalizeOptionalValue(request.MoTaNgan);
        tour.MoTaChiTiet = NormalizeOptionalValue(request.MoTaChiTiet);
        tour.DieuKienTour = NormalizeOptionalValue(request.DieuKienTour);
        tour.GiaNguoiLonMacDinh = request.GiaNguoiLonMacDinh;
        tour.GiaTreEmMacDinh = request.GiaTreEmMacDinh;
        tour.TrangThai = request.TrangThai;
        tour.UpdatedAt = DateTime.UtcNow;
        tour.LoaiTour = loaiTour;
        tour.DiaDiemKhoiHanh = diaDiemKhoiHanh;

        await _tourRepository.SaveChangesAsync();

        return MapAdminResponse(tour);
    }

    public async Task UpdateStatusAsync(ulong id, UpdateTourStatusRequestDto request)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        tour.TrangThai = request.TrangThai;
        tour.UpdatedAt = DateTime.UtcNow;

        await _tourRepository.SaveChangesAsync();
    }

    public async Task HideAsync(ulong id)
    {
        var tour = await _tourRepository.GetTrackedByIdAsync(id)
            ?? throw new KeyNotFoundException("Tour không tồn tại.");

        tour.TrangThai = TrangThaiTour.an;
        tour.UpdatedAt = DateTime.UtcNow;

        await _tourRepository.SaveChangesAsync();
    }

    private async Task EnsureMaTourIsUniqueAsync(string maTour, ulong? currentId = null)
    {
        var existingTour = await _tourRepository.GetByMaTourAsync(maTour);
        if (existingTour is not null && existingTour.Id != currentId)
        {
            throw new InvalidOperationException("Mã tour đã tồn tại.");
        }
    }

    private async Task<LoaiTour> EnsureLoaiTourExistsAsync(ulong loaiTourId)
    {
        return await _loaiTourRepository.GetByIdAsync(loaiTourId)
            ?? throw new KeyNotFoundException("Loại tour không tồn tại.");
    }

    private async Task<DiaDiem> EnsureDiaDiemExistsAsync(ulong diaDiemId)
    {
        return await _diaDiemRepository.GetByIdAsync(diaDiemId)
            ?? throw new KeyNotFoundException("Địa điểm khởi hành không tồn tại.");
    }

    private static void ValidateDuration(int soNgay, int soDem)
    {
        if (soNgay <= 0)
        {
            throw new InvalidOperationException("Số ngày phải lớn hơn 0.");
        }

        if (soDem < 0)
        {
            throw new InvalidOperationException("Số đêm không được nhỏ hơn 0.");
        }

        if (soDem >= soNgay)
        {
            throw new InvalidOperationException("Số đêm phải nhỏ hơn số ngày.");
        }
    }

    private static void ValidatePrice(decimal? value, string errorMessage)
    {
        if (value.HasValue && value.Value < 0)
        {
            throw new InvalidOperationException(errorMessage);
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
            DiaDiemKhoiHanhId = tour.DiaDiemKhoiHanhId,
            TenDiaDiemKhoiHanh = tour.DiaDiemKhoiHanh?.TenDiaDiem ?? string.Empty,
            SoNgay = tour.SoNgay,
            SoDem = tour.SoDem,
            PhuongTien = tour.PhuongTien,
            MoTaNgan = tour.MoTaNgan,
            GiaNguoiLonMacDinh = tour.GiaNguoiLonMacDinh,
            GiaTreEmMacDinh = tour.GiaTreEmMacDinh,
            TrangThai = tour.TrangThai.ToString()
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
            DiaDiemKhoiHanhId = tour.DiaDiemKhoiHanhId,
            TenDiaDiemKhoiHanh = tour.DiaDiemKhoiHanh?.TenDiaDiem ?? string.Empty,
            SoNgay = tour.SoNgay,
            SoDem = tour.SoDem,
            PhuongTien = tour.PhuongTien,
            MoTaNgan = tour.MoTaNgan,
            MoTaChiTiet = tour.MoTaChiTiet,
            DieuKienTour = tour.DieuKienTour,
            GiaNguoiLonMacDinh = tour.GiaNguoiLonMacDinh,
            GiaTreEmMacDinh = tour.GiaTreEmMacDinh,
            TrangThai = tour.TrangThai.ToString(),
            CreatedAt = tour.CreatedAt,
            UpdatedAt = tour.UpdatedAt
        };
    }
}
