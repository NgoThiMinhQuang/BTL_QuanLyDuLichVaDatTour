using BLL.DTOs.Auth;
using BLL.Interfaces;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;
using Microsoft.AspNetCore.Identity;

namespace BLL.Services;

public class AuthService : IAuthService
{
    private readonly INguoiDungRepository _nguoiDungRepository;
    private readonly IPasswordHasher<NguoiDung> _passwordHasher;

    public AuthService(INguoiDungRepository nguoiDungRepository, IPasswordHasher<NguoiDung> passwordHasher)
    {
        _nguoiDungRepository = nguoiDungRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var existingUser = await _nguoiDungRepository.GetByEmailAsync(normalizedEmail);

        if (existingUser is not null)
        {
            throw new InvalidOperationException("Email đã tồn tại.");
        }

        var nguoiDung = new NguoiDung
        {
            Email = normalizedEmail,
            HoTen = request.HoTen.Trim(),
            SoDienThoai = NormalizeOptionalValue(request.SoDienThoai),
            DiaChi = NormalizeOptionalValue(request.DiaChi),
            AnhDaiDien = NormalizeOptionalValue(request.AnhDaiDien),
            VaiTro = VaiTroNguoiDung.khach_hang,
            TrangThai = TrangThaiNguoiDung.hoat_dong
        };

        nguoiDung.MatKhau = _passwordHasher.HashPassword(nguoiDung, request.MatKhau);

        await _nguoiDungRepository.AddAsync(nguoiDung);
        await _nguoiDungRepository.SaveChangesAsync();

        return new RegisterResponseDto
        {
            Id = nguoiDung.Id,
            Email = nguoiDung.Email,
            HoTen = nguoiDung.HoTen,
            VaiTro = nguoiDung.VaiTro.ToString(),
            TrangThai = nguoiDung.TrangThai.ToString()
        };
    }

    private static string? NormalizeOptionalValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }
}
