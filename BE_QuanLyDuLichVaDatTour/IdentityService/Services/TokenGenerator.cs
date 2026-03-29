using IdentityService.Interfaces;
using IdentityService.Models.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IdentityService.Services;

public class TokenGenerator : ITokenGenerator
{
    private readonly IConfiguration _configuration;

    public TokenGenerator(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateAccessToken(NguoiDung nguoiDung)
    {
        var jwtSection = _configuration.GetSection("Jwt");
        var secret = jwtSection["Secret"] ?? throw new InvalidOperationException("Jwt:Secret chưa được cấu hình.");
        var issuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer chưa được cấu hình.");
        var audience = jwtSection["Audience"] ?? throw new InvalidOperationException("Jwt:Audience chưa được cấu hình.");
        var expiresIn = TimeSpan.FromMinutes(GetExpiryMinutes());

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
        return tokenHandler.WriteToken(accessToken);
    }

    public int GetExpirySeconds()
    {
        return GetExpiryMinutes() * 60;
    }

    private int GetExpiryMinutes()
    {
        var jwtSection = _configuration.GetSection("Jwt");
        return int.TryParse(jwtSection["ExpiryMinutes"], out var parsedExpiryMinutes)
            ? parsedExpiryMinutes
            : throw new InvalidOperationException("Jwt:ExpiryMinutes chưa hợp lệ.");
    }
}
