using System;
using System.Net.Http;
using System.Reflection;
using FluentValidation;
using MassTransit;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Polly;
using Polly.Extensions.Http;
using Polly.Timeout;
using PostIt.Common.Behaviors;
using PostIt.Common.Options.Database;
using PostIt.Common.Options.HttpClient;
using PostIt.Common.Options.RabbitMq;
using Serilog;

namespace PostIt.Common;

public static class DependencyInjection
{
    public static IServiceCollection AddDbContext<T>(this IServiceCollection services) where T : DbContext
    {
        services.AddDbContext<T>((sp, opt) =>
        {
            DatabaseOptions databaseOptions = sp.GetRequiredService<IOptions<DatabaseOptions>>().Value;
            opt.UseSqlServer(databaseOptions.ConnectionString, act =>
            {
                act.EnableRetryOnFailure(databaseOptions.MaxRetryCount);
                act.CommandTimeout(databaseOptions.SecondsDelayOnRetry);
            });
            opt.EnableDetailedErrors(databaseOptions.EnableDetailedError);
            opt.EnableSensitiveDataLogging(databaseOptions.EnableSensitiveDataLogging);
        });
        return services;
    }

    public static IServiceCollection AddDefaultOptions(this IServiceCollection services)
    {
        services.ConfigureOptions<DatabaseOptionsSetup>();
        services.ConfigureOptions<RabbitMqOptionsSetup>();
        services.ConfigureOptions<HttpClientOptionsSetup>();
        return services;
    }

    public static IServiceCollection AddMapper(this IServiceCollection services)
    {
        services.AddAutoMapper(Assembly.GetEntryAssembly());
        return services;
    }

    public static IServiceCollection AddMediatr(this IServiceCollection services)
    {
        services.AddMediatR(Assembly.GetEntryAssembly()!);
        return services;
    }

    public static IServiceCollection AddValidators(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetEntryAssembly());
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        return services;
    }

    public static IServiceCollection AddRabbitMq(this IServiceCollection services)
    {
        services.AddMassTransit(configure =>
        {
            configure.AddConsumers(Assembly.GetEntryAssembly());

            configure.UsingRabbitMq((context, configurator) =>
                {
                    RabbitMqOptions rabbitMqOptions = context.GetRequiredService<IOptions<RabbitMqOptions>>().Value;
                    configurator.Host(rabbitMqOptions.Host);
                    configurator.ConfigureEndpoints(
                        context,
                        new KebabCaseEndpointNameFormatter(rabbitMqOptions.ServiceName, false));
                    configurator.UseMessageRetry(retryConfigurator =>
                    {
                        retryConfigurator.Interval(
                            rabbitMqOptions.MaxRetryCount,
                            TimeSpan.FromSeconds(rabbitMqOptions.SecondsDelayOnRetry));
                    });
                });
        });
        return services;
    }

    public static IServiceCollection AddClient<T>(this IServiceCollection services)
    where T : class
    {
        var serviceProvider = services.BuildServiceProvider();
        ILogger logger = serviceProvider.GetRequiredService<ILogger>();
        HttpClientOptions httpClientOptions = serviceProvider.GetRequiredService<IOptions<HttpClientOptions>>().Value;
        services.AddHttpClient<T>(client =>
            client.BaseAddress = new Uri(httpClientOptions.ClientAddress))
            .AddTransientHttpErrorPolicy(_ => GetRetryPolicy(httpClientOptions, logger))
            .AddTransientHttpErrorPolicy(_ => GetCircuitBreakerPolicy(httpClientOptions, logger))
            .AddPolicyHandler(Policy.TimeoutAsync<HttpResponseMessage>(httpClientOptions.SecondsTimeout));
        return services;
    }

    private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy(HttpClientOptions httpClientOptions, ILogger logger)
    {
        var rng = new Random();
        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .Or<TimeoutRejectedException>()
            .WaitAndRetryAsync(
                httpClientOptions.MaxRetryCount,
                retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)) +
                    TimeSpan.FromMilliseconds(rng.Next(0, 1000)),
                onRetry: (outcome, timeSpan, retryAttempt) =>
                    logger.Warning($"Delaying for {timeSpan.TotalSeconds} seconds, then making retry {retryAttempt}")
            );
    }

    private static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy(HttpClientOptions httpClientOptions, ILogger logger)
    {
        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .Or<TimeoutRejectedException>()
            .CircuitBreakerAsync(
                httpClientOptions.NumberOfAllowedEvents,
                TimeSpan.FromSeconds(httpClientOptions.SecondsBreakDuration),
                onBreak: (outcome, timeSpan) =>
                    logger.Warning($"Opening the circuit for {timeSpan.TotalSeconds} seconds"),
                onReset: () => logger.Warning($"Closing the circuit...")
            );
    }
}