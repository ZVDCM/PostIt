using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace PostIt.Common.Options.Database;

public sealed class DatabaseOptionsSetup : IConfigureOptions<DatabaseOptions>
{
    private readonly IConfiguration _configuration;

    public DatabaseOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(DatabaseOptions options)
    {
        _configuration.GetSection(nameof(DatabaseOptions)).Bind(options);
    }
}