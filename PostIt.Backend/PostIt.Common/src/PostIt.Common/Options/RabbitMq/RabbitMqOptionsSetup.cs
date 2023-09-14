using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace PostIt.Common.Options.RabbitMq;

public sealed class RabbitMqOptionsSetup : IConfigureOptions<RabbitMqOptions>
{
    private readonly IConfiguration _configuration;

    public RabbitMqOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(RabbitMqOptions options)
    {
        _configuration.GetSection(nameof(RabbitMqOptions)).Bind(options);
    }
}
