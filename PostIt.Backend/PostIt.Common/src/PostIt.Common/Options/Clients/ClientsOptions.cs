using System.Collections.Generic;

namespace PostIt.Common.Options.AllowedHosts;

public sealed class ClientsOptions
{
    public string Hosts { get; set; } = string.Empty;
}