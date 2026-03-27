using BLL.DTOs.Auth;

namespace BLL.Interfaces;

public interface IAuthService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request);

    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);

    Task<CurrentUserResponseDto> GetCurrentUserAsync(long userId);

    Task<CurrentUserResponseDto> UpdateCurrentUserAsync(long userId, UpdateCurrentUserRequestDto request);

    Task ChangePasswordAsync(long userId, ChangePasswordRequestDto request);
}
