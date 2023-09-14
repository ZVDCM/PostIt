namespace PostIt.Common.Options.RabbitMq;

public sealed class RabbitMqOptions
{
    public string Host { get; init; } = string.Empty;
    public string ServiceName { get; init; } = string.Empty;
    public int MaxRetryCount { get; set; }
    public int SecondsDelayOnRetry { get; set; }
}