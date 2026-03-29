using IdentityService.Models.Entities;

namespace IdentityService.Interfaces;

public interface ITokenGenerator
{
    string GenerateAccessToken(NguoiDung nguoiDung);

    int GetExpirySeconds();
}
