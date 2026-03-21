using BLL.DTOs.Auth;

namespace BLL.Interfaces;

public interface IAuthService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request);

    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);

    Task<CurrentUserResponseDto> GetCurrentUserAsync(ulong userId);

    Task<CurrentUserResponseDto> UpdateCurrentUserAsync(ulong userId, UpdateCurrentUserRequestDto request);

    Task ChangePasswordAsync(ulong userId, ChangePasswordRequestDto request);
}
