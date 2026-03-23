using BLL.DTOs.Auth;
using BLL.Interfaces;
using DAL.Interfaces;
using Entity.Entities;
using Entity.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BLL.Services;

public class AuthService : IAuthService
{
    private readonly INguoiDungRepository _nguoiDungRepository;
    private readonly IPasswordHasher<NguoiDung> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AuthService(INguoiDungRepository nguoiDungRepository, IPasswordHasher<NguoiDung> passwordHasher, IConfiguration configuration)
    {
        _nguoiDungRepository = nguoiDungRepository;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var normalizedEmail = NormalizeEmail(request.Email);
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

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var normalizedEmail = NormalizeEmail(request.Email);
        var nguoiDung = await _nguoiDungRepository.GetTrackedByEmailAsync(normalizedEmail);

        if (nguoiDung is null)
        {
            throw new UnauthorizedAccessException("Email hoặc mật khẩu không chính xác.");
        }

        if (nguoiDung.TrangThai == TrangThaiNguoiDung.bi_khoa)
        {
            throw new InvalidOperationException("Tài khoản đã bị khóa.");
        }

        var shouldSavePasswordHash = false;
        PasswordVerificationResult passwordVerificationResult;
        try
        {
            passwordVerificationResult = _passwordHasher.VerifyHashedPassword(nguoiDung, nguoiDung.MatKhau, request.MatKhau);
        }
        catch (FormatException)
        {
            if (nguoiDung.MatKhau != request.MatKhau)
            {
                throw new UnauthorizedAccessException("Email hoặc mật khẩu không chính xác.");
            }

            passwordVerificationResult = PasswordVerificationResult.Success;
            shouldSavePasswordHash = true;
        }

        if (passwordVerificationResult == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Email hoặc mật khẩu không chính xác.");
        }

        if (passwordVerificationResult == PasswordVerificationResult.SuccessRehashNeeded)
        {
            shouldSavePasswordHash = true;
        }

        if (shouldSavePasswordHash)
        {
            nguoiDung.MatKhau = _passwordHasher.HashPassword(nguoiDung, request.MatKhau);
            nguoiDung.UpdatedAt = DateTime.UtcNow;
            await _nguoiDungRepository.SaveChangesAsync();
        }
        var jwtSection = _configuration.GetSection("Jwt");
        var secret = jwtSection["Secret"] ?? throw new InvalidOperationException("Jwt:Secret chưa được cấu hình.");
        var issuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer chưa được cấu hình.");
        var audience = jwtSection["Audience"] ?? throw new InvalidOperationException("Jwt:Audience chưa được cấu hình.");
        var expiryMinutes = int.TryParse(jwtSection["ExpiryMinutes"], out var parsedExpiryMinutes)
            ? parsedExpiryMinutes
            : throw new InvalidOperationException("Jwt:ExpiryMinutes chưa hợp lệ.");

        var expiresIn = TimeSpan.FromMinutes(expiryMinutes);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
            [
                new Claim(ClaimTypes.NameIdentifier, nguoiDung.Id.ToString()),
                new Claim(ClaimTypes.Email, nguoiDung.Email),
                new Claim(ClaimTypes.Name, nguoiDung.HoTen),
                new Claim(ClaimTypes.Role, nguoiDung.VaiTro.ToString())
            ]),
            Expires = DateTime.UtcNow.Add(expiresIn),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
                SecurityAlgorithms.HmacSha256)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var accessToken = tokenHandler.CreateToken(tokenDescriptor);

        return new LoginResponseDto
        {
            AccessToken = tokenHandler.WriteToken(accessToken),
            TokenType = "Bearer",
            ExpiresIn = (int)expiresIn.TotalSeconds,
            Id = nguoiDung.Id,
            Email = nguoiDung.Email,
            HoTen = nguoiDung.HoTen,
            VaiTro = nguoiDung.VaiTro.ToString(),
            TrangThai = nguoiDung.TrangThai.ToString()
        };
    }

    public async Task<CurrentUserResponseDto> GetCurrentUserAsync(ulong userId)
    {
        var nguoiDung = await _nguoiDungRepository.GetByIdAsync(userId);
        if (nguoiDung is null)
        {
            throw new UnauthorizedAccessException("Người dùng không tồn tại hoặc token không hợp lệ.");
        }

        return MapCurrentUserResponse(nguoiDung);
    }

    public async Task<CurrentUserResponseDto> UpdateCurrentUserAsync(ulong userId, UpdateCurrentUserRequestDto request)
    {
        var nguoiDung = await _nguoiDungRepository.GetTrackedByIdAsync(userId);
        if (nguoiDung is null)
        {
            throw new UnauthorizedAccessException("Người dùng không tồn tại hoặc token không hợp lệ.");
        }

        nguoiDung.HoTen = request.HoTen.Trim();
        nguoiDung.SoDienThoai = NormalizeOptionalValue(request.SoDienThoai);
        nguoiDung.DiaChi = NormalizeOptionalValue(request.DiaChi);
        nguoiDung.AnhDaiDien = NormalizeOptionalValue(request.AnhDaiDien);
        nguoiDung.UpdatedAt = DateTime.UtcNow;

        await _nguoiDungRepository.SaveChangesAsync();

        return MapCurrentUserResponse(nguoiDung);
    }

    public async Task ChangePasswordAsync(ulong userId, ChangePasswordRequestDto request)
    {
        var nguoiDung = await _nguoiDungRepository.GetTrackedByIdAsync(userId);
        if (nguoiDung is null)
        {
            throw new UnauthorizedAccessException("Người dùng không tồn tại hoặc token không hợp lệ.");
        }

        PasswordVerificationResult passwordVerificationResult;
        try
        {
            passwordVerificationResult = _passwordHasher.VerifyHashedPassword(nguoiDung, nguoiDung.MatKhau, request.MatKhauHienTai);
        }
        catch (FormatException)
        {
            throw new UnauthorizedAccessException("Mật khẩu hiện tại trong cơ sở dữ liệu không đúng định dạng băm.");
        }

        if (passwordVerificationResult == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedAccessException("Mật khẩu hiện tại không chính xác.");
        }

        nguoiDung.MatKhau = _passwordHasher.HashPassword(nguoiDung, request.MatKhauMoi);
        nguoiDung.UpdatedAt = DateTime.UtcNow;

        await _nguoiDungRepository.SaveChangesAsync();
    }

    private static CurrentUserResponseDto MapCurrentUserResponse(NguoiDung nguoiDung)
    {
        return new CurrentUserResponseDto
        {
            Id = nguoiDung.Id,
            Email = nguoiDung.Email,
            HoTen = nguoiDung.HoTen,
            SoDienThoai = nguoiDung.SoDienThoai,
            DiaChi = nguoiDung.DiaChi,
            AnhDaiDien = nguoiDung.AnhDaiDien,
            VaiTro = nguoiDung.VaiTro.ToString(),
            TrangThai = nguoiDung.TrangThai.ToString()
        };
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
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
