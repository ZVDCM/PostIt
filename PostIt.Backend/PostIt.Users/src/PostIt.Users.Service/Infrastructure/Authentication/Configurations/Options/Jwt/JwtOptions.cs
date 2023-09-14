namespace PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Jwt;

public sealed class JwtOptions
{
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    public string Secret { get; init; } = string.Empty;
    public int SecondsAccessTokenExpiration { get; init; }
    public int SecondsRefreshTokenExpiration { get; init; }
    public string CookieName { get; init; } = string.Empty;
}