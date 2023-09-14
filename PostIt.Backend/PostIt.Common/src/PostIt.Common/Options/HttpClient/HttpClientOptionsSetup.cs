using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace PostIt.Common.Options.HttpClient;

public sealed class HttpClientOptionsSetup : IConfigureOptions<HttpClientOptions>
{
    private readonly IConfiguration _configuration;

    public HttpClientOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(HttpClientOptions options)
    {
        _configuration.GetSection(nameof(HttpClientOptions)).Bind(options);
    }
}