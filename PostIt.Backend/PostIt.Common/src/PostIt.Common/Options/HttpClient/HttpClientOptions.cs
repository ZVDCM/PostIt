namespace PostIt.Common.Options.HttpClient;

public sealed class HttpClientOptions
{
    public string ClientAddress { get; set; } = string.Empty;
    public int SecondsTimeout { get; set; }
    public int MaxRetryCount { get; set; }
    public int NumberOfAllowedEvents { get; set; }
    public int SecondsBreakDuration { get; set; }
}