namespace PostIt.Common.Options.Database;

public sealed class DatabaseOptions
{
    public string ConnectionString { get; init; } = string.Empty;
    public bool EnableDetailedError { get; init; }
    public bool EnableSensitiveDataLogging { get; init; }
    public int MaxRetryCount { get; init; }
    public int SecondsDelayOnRetry { get; init; }
}