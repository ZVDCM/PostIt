namespace PostIt.Users.Service.Infrastructure.Email.Configurations.Options;

public sealed class EmailOptions
{
    public string DefaultFrom { get; init; } = string.Empty;
    public string SendGridApiKey { get; init; } = string.Empty;
}