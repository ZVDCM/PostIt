using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace PostIt.Common.Options.AllowedHosts;

public sealed class ClientsOptionsSetup : IConfigureOptions<ClientsOptions>
{
    private readonly IConfiguration _configuration;

    public ClientsOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(ClientsOptions options)
    {
        _configuration.GetSection(nameof(ClientsOptions)).Bind(options);
    }
}
