using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Jwt;

public sealed class JwtOptionsSetup : IConfigureOptions<JwtOptions>
{
    private readonly IConfiguration _configuration;

    public JwtOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(JwtOptions options)
    {
        _configuration.GetSection(nameof(JwtOptions)).Bind(options);
    }
}