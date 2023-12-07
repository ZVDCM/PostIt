using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using PostIt.Common;
using PostIt.Common.Domain.Likes;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Options.AllowedHosts;
using PostIt.Posts.Service.Infrastructure.Client;
using PostIt.Posts.Service.Infrastructure.Persistence;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using PostIt.Posts.Service.Infrastructure.Repositories;

namespace PostIt.Posts.Service;

public static class DependencyInjection
{
    public static IServiceCollection AddDependencies(this IServiceCollection services)
    {
        services
            .AddDefaultOptions()
            .AddCors()
            .AddDbContext<ApplicationDbContext>()
            .AddMapper()
            .AddMediatr()
            .AddValidators()
            .AddRabbitMq()
            .AddServices()
            .AddClient<UsersClient>();

        return services;
    }

    private static IServiceCollection AddCors(this IServiceCollection services)
    {
        var serviceProvider = services.BuildServiceProvider();
        var clientsOptions = serviceProvider.GetRequiredService<IOptions<ClientsOptions>>().Value;
        services.AddCors(options => options.AddDefaultPolicy(builder =>
        {
            builder
                .WithOrigins(clientsOptions.Hosts.Split(';'))
                .AllowCredentials()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }));
        return services;
    }

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IPostRepository, PostRepository>();
        services.AddScoped<ILikeRepository, LikeRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUsersClient, UsersClient>();
        return services;
    }
}