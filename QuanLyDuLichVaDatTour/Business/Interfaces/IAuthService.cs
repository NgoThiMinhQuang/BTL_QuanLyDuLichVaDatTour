using BLL.DTOs.Auth;

namespace BLL.Interfaces;

public interface IAuthService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request);

    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
}
