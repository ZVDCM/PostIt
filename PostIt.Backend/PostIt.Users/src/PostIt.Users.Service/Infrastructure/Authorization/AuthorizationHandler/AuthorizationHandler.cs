using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using PostIt.Common.Identifiers;
using PostIt.Common.Utils;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Infrastructure.Authorization.AuthorizationHandler;

public sealed class AuthorizationHandler : AuthorizationHandler<AuthorizationRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserRepository _userRepository;

    public AuthorizationHandler(IHttpContextAccessor httpContextAccessor, IUserRepository userRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _userRepository = userRepository;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        AuthorizationRequirement authorizationRequirement)
    {
        User? user = await GetUserAsync(context);
        if (user is null) { context.Fail(); return; }

        switch (authorizationRequirement.Requirement)
        {
            case PolicyConstants.SessionPolicy:
                if (SessionAuthorizationSucceeded(context, user))
                {
                    context.Succeed(authorizationRequirement);
                    return;
                }
                break;

            case PolicyConstants.OneShotPolicy:
                context.Succeed(authorizationRequirement);
                return;
                
            default:
                throw new NotSupportedException();
        }
        context.Fail();
    }

    private bool SessionAuthorizationSucceeded(AuthorizationHandlerContext context, User user)
    {
        string? nbf = GetNbf(context);
        if (nbf is null) return false;
        DateTime? dateTimeNbf = DateTimeHelper.ConvertNbfSecondsToDateTime(nbf);
        if (dateTimeNbf is null) return false;

        Token? latestRefreshToken = ValidateToken(user.GetLatestRefreshToken());
        if (latestRefreshToken is null) return false;

        if (dateTimeNbf != latestRefreshToken.IssuedAt.Date) return false;
        return true;
    }

    private async Task<User?> GetUserAsync(AuthorizationHandlerContext context)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext is null) return null;

        string? idFromClaims = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (idFromClaims is null) return null;

        if (!Guid.TryParse(idFromClaims, out Guid guidId)) return null;
        UserId userId = new(guidId);
        User? user = await _userRepository.GetUserAsync(u => u.Id == userId, httpContext.RequestAborted);

        return user;
    }

    private string? GetNbf(AuthorizationHandlerContext context)
    {
        string? nbf = context.User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Nbf)?.Value;
        if (nbf is null) return null;

        return nbf;
    }

    private Token? ValidateToken(Token? token)
    {
        if (token is null || token.IsDisabled) return null;
        if (token.IsExpired())
        {
            token.Disable();
            return null;
        }
        return token;
    }
}