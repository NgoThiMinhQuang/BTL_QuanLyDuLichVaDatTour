using System.Security.Claims;

namespace IdentityService.Controllers;

public static class ControllerClaimsExtensions
{
    public static bool TryGetCurrentUserId(this ClaimsPrincipal user, out long userId)
    {
        var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? user.FindFirstValue("sub")
            ?? user.FindFirstValue("nameid");

        return long.TryParse(userIdClaim, out userId);
    }
}
