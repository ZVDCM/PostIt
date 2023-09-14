using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Token;

public sealed class TokenOptionsSetup : IConfigureOptions<TokenOptions>
{
    private readonly IConfiguration _configuration;

    public TokenOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(TokenOptions options)
    {
        _configuration.GetSection(nameof(TokenOptions)).Bind(options);
    }
}
