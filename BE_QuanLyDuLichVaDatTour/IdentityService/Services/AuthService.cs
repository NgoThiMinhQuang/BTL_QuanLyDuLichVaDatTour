using IdentityService.Data;
using IdentityService.DTOs.Auth;
using IdentityService.Interfaces;
using IdentityService.Models.Entities;
using IdentityService.Models.Enums;
using IdentityService.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace IdentityService.Services;

public class AuthService : IAuthService
{
    private const int ResetTokenExpiryMinutes = 30;
    private const string ForgotPasswordMessage = "Nếu email tồn tại, hệ thống đã tạo liên kết đặt lại mật khẩu.";

    private readonly AppDbContext _dbContext;
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<NguoiDung> _passwordHasher;
    private readonly ITokenGenerator _tokenGenerator;

    public AuthService(AppDbContext dbContext, IUserRepository userRepository, IPasswordHasher<NguoiDung> passwordHasher, ITokenGenerator tokenGenerator)
    {
        _dbContext = dbContext;
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tokenGenerator = tokenGenerator;
    }

    public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        var normalizedEmail = NormalizeEmail(request.Email);
        var existingUser = await _userRepository.GetByEmailAsync(normalizedEmail);

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

        await _userRepository.AddAsync(nguoiDung);
        await _userRepository.SaveChangesAsync();

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
        var nguoiDung = await _userRepository.GetTrackedByEmailAsync(normalizedEmail);

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
            await _userRepository.SaveChangesAsync();
        }

        return new LoginResponseDto
        {
            AccessToken = _tokenGenerator.GenerateAccessToken(nguoiDung),
            TokenType = "Bearer",
            ExpiresIn = _tokenGenerator.GetExpirySeconds(),
            Id = nguoiDung.Id,
            Email = nguoiDung.Email,
            HoTen = nguoiDung.HoTen,
            VaiTro = nguoiDung.VaiTro.ToString(),
            TrangThai = nguoiDung.TrangThai.ToString()
        };
    }

    public async Task<CurrentUserResponseDto> GetCurrentUserAsync(long userId)
    {
        var nguoiDung = await _userRepository.GetByIdAsync(userId);
        if (nguoiDung is null)
        {
            throw new UnauthorizedAccessException("Người dùng không tồn tại hoặc token không hợp lệ.");
        }

        return MapCurrentUserResponse(nguoiDung);
    }

    public async Task<CurrentUserResponseDto> UpdateCurrentUserAsync(long userId, UpdateCurrentUserRequestDto request)
    {
        var nguoiDung = await _userRepository.GetTrackedByIdAsync(userId);
        if (nguoiDung is null)
        {
            throw new UnauthorizedAccessException("Người dùng không tồn tại hoặc token không hợp lệ.");
        }

        nguoiDung.HoTen = request.HoTen.Trim();
        nguoiDung.SoDienThoai = NormalizeOptionalValue(request.SoDienThoai);
        nguoiDung.DiaChi = NormalizeOptionalValue(request.DiaChi);
        nguoiDung.AnhDaiDien = NormalizeOptionalValue(request.AnhDaiDien);
        nguoiDung.UpdatedAt = DateTime.UtcNow;

        await _userRepository.SaveChangesAsync();

        return MapCurrentUserResponse(nguoiDung);
    }

    public async Task ChangePasswordAsync(long userId, ChangePasswordRequestDto request)
    {
        var nguoiDung = await _userRepository.GetTrackedByIdAsync(userId);
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

        await _userRepository.SaveChangesAsync();
    }

    public async Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordRequestDto request)
    {
        var normalizedEmail = NormalizeEmail(request.Email);
        var nguoiDung = await _userRepository.GetTrackedByEmailAsync(normalizedEmail);

        if (nguoiDung is null || nguoiDung.TrangThai == TrangThaiNguoiDung.bi_khoa)
        {
            return new ForgotPasswordResponseDto { Message = ForgotPasswordMessage };
        }

        var now = DateTime.UtcNow;
        var token = GenerateResetToken();
        var expiresAt = now.AddMinutes(ResetTokenExpiryMinutes);

        var activeTokens = await _dbContext.PasswordResetTokens
            .Where(x => x.NguoiDungId == nguoiDung.Id && x.UsedAt == null && x.ExpiresAt > now)
            .ToListAsync();

        foreach (var activeToken in activeTokens)
        {
            activeToken.UsedAt = now;
        }

        await _dbContext.PasswordResetTokens.AddAsync(new PasswordResetToken
        {
            NguoiDungId = nguoiDung.Id,
            TokenHash = HashToken(token),
            ExpiresAt = expiresAt,
            CreatedAt = now
        });

        await _dbContext.SaveChangesAsync();

        return new ForgotPasswordResponseDto
        {
            Message = ForgotPasswordMessage,
            ResetToken = token,
            ResetLink = $"/reset-password?token={Uri.EscapeDataString(token)}",
            ExpiresAt = expiresAt
        };
    }

    public async Task ResetPasswordAsync(ResetPasswordRequestDto request)
    {
        var tokenHash = HashToken(request.Token.Trim());
        var now = DateTime.UtcNow;
        var resetToken = await _dbContext.PasswordResetTokens
            .Include(x => x.NguoiDung)
            .FirstOrDefaultAsync(x => x.TokenHash == tokenHash);

        if (resetToken is null || resetToken.UsedAt is not null || resetToken.ExpiresAt <= now)
        {
            throw new InvalidOperationException("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
        }

        if (resetToken.NguoiDung.TrangThai == TrangThaiNguoiDung.bi_khoa)
        {
            throw new InvalidOperationException("Tài khoản đã bị khóa.");
        }

        resetToken.NguoiDung.MatKhau = _passwordHasher.HashPassword(resetToken.NguoiDung, request.MatKhauMoi);
        resetToken.NguoiDung.UpdatedAt = now;
        resetToken.UsedAt = now;

        var otherActiveTokens = await _dbContext.PasswordResetTokens
            .Where(x => x.NguoiDungId == resetToken.NguoiDungId && x.Id != resetToken.Id && x.UsedAt == null)
            .ToListAsync();

        foreach (var activeToken in otherActiveTokens)
        {
            activeToken.UsedAt = now;
        }

        await _dbContext.SaveChangesAsync();
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

    private static string GenerateResetToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));
    }

    private static string HashToken(string token)
    {
        var tokenBytes = System.Text.Encoding.UTF8.GetBytes(token);
        var hashBytes = SHA256.HashData(tokenBytes);
        return Convert.ToHexString(hashBytes);
    }
}
