using BE_QuanLyDuLichVaDatTour.DTOs.Admin;
using BE_QuanLyDuLichVaDatTour.DTOs.LienHe;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class LienHeService : ILienHeService
{
    private readonly ILienHeRepository _repository;
    private readonly ITinNhanRepository _tinNhanRepository;

    public LienHeService(ILienHeRepository repository, ITinNhanRepository tinNhanRepository)
    {
        _repository = repository;
        _tinNhanRepository = tinNhanRepository;
    }

    public async Task<LienHeListResponseDto> SearchAsync(SearchLienHeRequestDto request)
    {
        TrangThaiLienHe? trangThai = null;
        if (!string.IsNullOrWhiteSpace(request.TrangThai) && Enum.TryParse<TrangThaiLienHe>(request.TrangThai, true, out var tt))
        {
            trangThai = tt;
        }

        var items = await _repository.SearchAsync(request.Keyword, trangThai, request.Page, request.PageSize);
        var totalCount = await _repository.CountAsync(request.Keyword, trangThai);

        return new LienHeListResponseDto
        {
            Items = items.Select(MapToDto).ToList(),
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<List<AdminSupportTicketDto>> GetSupportTicketsAsync(SearchLienHeRequestDto request)
    {
        TrangThaiLienHe? trangThai = null;
        if (!string.IsNullOrWhiteSpace(request.TrangThai) && Enum.TryParse<TrangThaiLienHe>(request.TrangThai, true, out var tt))
        {
            trangThai = tt;
        }

        var keyword = request.Keyword?.Trim().ToLower();
        var tickets = new List<AdminSupportTicketDto>();

        var lienHes = await _repository.SearchAsync(request.Keyword, trangThai, 1, 1000);
        tickets.AddRange(lienHes.Select(x => new AdminSupportTicketDto
        {
            Id = x.Id,
            Source = "lienhe",
            KhachHangId = 0,
            HoTen = x.HoTen,
            Email = x.Email,
            SoDienThoai = x.SoDienThoai,
            ChuDe = x.ChuDe,
            NoiDung = x.NoiDung,
            TrangThai = x.TrangThai.ToString(),
            PhanHoi = x.PhanHoi,
            NgayGui = x.NgayGui,
            NgayXuLy = x.NgayXuLy,
        }));

        var generalMessages = await _tinNhanRepository.GetAllGeneralWithNguoiGuiAsync();
        foreach (var group in generalMessages.GroupBy(x => x.KhachHangId))
        {
            var ordered = group.OrderBy(x => x.ThoiGianGui).ToList();
            var latest = ordered.Last();
            var latestAdmin = ordered.LastOrDefault(x => x.NguoiGui?.VaiTro == VaiTroNguoiDung.admin);
            var latestCustomer = ordered.LastOrDefault(x => x.NguoiGui?.VaiTro != VaiTroNguoiDung.admin);
            var khachHang = latest.KhachHang ?? latestCustomer?.NguoiGui ?? latest.NguoiGui;
            var status = latestCustomer != null && (latestAdmin is null || latestCustomer.ThoiGianGui > latestAdmin.ThoiGianGui)
                ? TrangThaiLienHe.moi.ToString()
                : TrangThaiLienHe.da_xu_ly.ToString();

            if (trangThai.HasValue && status != trangThai.Value.ToString())
                continue;

            var ticket = new AdminSupportTicketDto
            {
                Id = group.Key,
                Source = "tinnhan",
                KhachHangId = group.Key,
                HoTen = khachHang?.HoTen ?? "Khách hàng",
                Email = khachHang?.Email,
                SoDienThoai = khachHang?.SoDienThoai,
                ChuDe = "Chat hỗ trợ",
                NoiDung = latest.NoiDung,
                TrangThai = status,
                PhanHoi = latestAdmin?.NoiDung,
                NgayGui = latest.ThoiGianGui,
                NgayXuLy = latestAdmin?.ThoiGianGui,
            };

            if (!string.IsNullOrWhiteSpace(keyword) &&
                !ticket.HoTen.ToLower().Contains(keyword) &&
                !(ticket.Email?.ToLower().Contains(keyword) ?? false) &&
                !(ticket.SoDienThoai?.Contains(keyword) ?? false) &&
                !ticket.NoiDung.ToLower().Contains(keyword))
            {
                continue;
            }

            tickets.Add(ticket);
        }

        return tickets.OrderByDescending(x => x.NgayGui).ToList();
    }

    public async Task<LienHeAdminResponseDto> GetByIdAsync(long id)
    {
        var item = await _repository.GetByIdAsync(id)
            ?? throw new KeyNotFoundException("Liên hệ không tồn tại.");
        return MapToDto(item);
    }

    public async Task UpdateStatusAsync(long id, UpdateLienHeStatusRequestDto request, long? adminId)
    {
        if (!Enum.TryParse<TrangThaiLienHe>(request.TrangThai, true, out var trangThai))
        {
            throw new InvalidOperationException("Trạng thái không hợp lệ.");
        }

        var item = await _repository.GetByIdTrackedAsync(id)
            ?? throw new KeyNotFoundException("Liên hệ không tồn tại.");

        item.TrangThai = trangThai;
        item.PhanHoi = request.PhanHoi;
        item.NguoiXuLyId = adminId;

        if (trangThai == TrangThaiLienHe.da_xu_ly || trangThai == TrangThaiLienHe.bo_qua)
        {
            item.NgayXuLy = DateTime.UtcNow;
        }

        item.UpdatedAt = DateTime.UtcNow;

        await _repository.SaveChangesAsync();
    }

    public async Task ReplyAsync(long id, string phanHoi, long adminId)
    {
        if (string.IsNullOrWhiteSpace(phanHoi))
            throw new InvalidOperationException("Nội dung phản hồi không được để trống.");

        var item = await _repository.GetByIdTrackedAsync(id)
            ?? throw new KeyNotFoundException("Liên hệ không tồn tại.");

        item.PhanHoi = phanHoi.Trim();
        item.NguoiXuLyId = adminId;
        item.TrangThai = TrangThaiLienHe.da_xu_ly;
        item.NgayXuLy = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;

        await _repository.SaveChangesAsync();
    }

    public async Task<List<UserLienHeResponseDto>> GetByEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return new List<UserLienHeResponseDto>();

        var items = await _repository.SearchAsync(null, null, 1, 100);
        return items
            .Where(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
            .Select(x => new UserLienHeResponseDto
            {
                Id = x.Id,
                ChuDe = x.ChuDe,
                NoiDung = x.NoiDung,
                TrangThai = x.TrangThai.ToString(),
                PhanHoi = x.PhanHoi,
                NgayGui = x.NgayGui,
                NgayXuLy = x.NgayXuLy
            })
            .OrderByDescending(x => x.NgayGui)
            .ToList();
    }

    public async Task<LienHeAdminResponseDto> CreateAsync(CreateLienHeRequestDto request)
    {
        var now = DateTime.UtcNow;
        var item = new LienHe
        {
            HoTen = request.HoTen.Trim(),
            Email = request.Email.Trim(),
            SoDienThoai = string.IsNullOrWhiteSpace(request.SoDienThoai) ? null : request.SoDienThoai.Trim(),
            ChuDe = request.ChuDe.Trim(),
            NoiDung = request.NoiDung.Trim(),
            TrangThai = TrangThaiLienHe.moi,
            NgayGui = now,
            CreatedAt = now,
            UpdatedAt = now,
        };

        await _repository.AddAsync(item);
        await _repository.SaveChangesAsync();

        return MapToDto(item);
    }

    private static LienHeAdminResponseDto MapToDto(LienHe item)
    {
        return new LienHeAdminResponseDto
        {
            Id = item.Id,
            HoTen = item.HoTen,
            Email = item.Email,
            SoDienThoai = item.SoDienThoai,
            ChuDe = item.ChuDe,
            NoiDung = item.NoiDung,
            TrangThai = item.TrangThai.ToString(),
            NguoiXuLyId = item.NguoiXuLyId,
            HoTenNguoiXuLy = item.NguoiXuLy?.HoTen,
            PhanHoi = item.PhanHoi,
            NgayGui = item.NgayGui,
            NgayXuLy = item.NgayXuLy,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt,
        };
    }
}