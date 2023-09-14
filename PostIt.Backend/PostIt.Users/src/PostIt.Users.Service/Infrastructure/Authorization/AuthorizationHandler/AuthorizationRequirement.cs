using Microsoft.AspNetCore.Authorization;

namespace PostIt.Users.Service.Infrastructure.Authorization.AuthorizationHandler;

public sealed class AuthorizationRequirement : IAuthorizationRequirement
{
    public string Requirement { get; init; }
    public AuthorizationRequirement(string requirement)
    {
        Requirement = requirement;
    }
}