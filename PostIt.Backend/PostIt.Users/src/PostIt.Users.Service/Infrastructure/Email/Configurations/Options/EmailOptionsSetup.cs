using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace PostIt.Users.Service.Infrastructure.Email.Configurations.Options;

public sealed class EmailOptionsSetup : IConfigureOptions<EmailOptions>
{
    private readonly IConfiguration _configuration;

    public EmailOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(EmailOptions options)
    {
        _configuration.GetSection(nameof(EmailOptions)).Bind(options);
    }
}