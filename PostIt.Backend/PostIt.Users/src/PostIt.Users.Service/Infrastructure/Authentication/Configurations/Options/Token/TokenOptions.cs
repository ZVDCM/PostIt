namespace PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Token;

public sealed class TokenOptions
{
    public int SecondsVerificationTokenExpiration { get; init; }
    public int SecondsForgotPasswordTokenExpiration { get; init; }
}