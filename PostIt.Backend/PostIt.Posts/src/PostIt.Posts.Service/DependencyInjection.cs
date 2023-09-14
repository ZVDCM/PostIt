using Microsoft.Extensions.DependencyInjection;
using PostIt.Common;
using PostIt.Posts.Service.Domain.Comments;
using PostIt.Posts.Service.Domain.Likes;
using PostIt.Posts.Service.Domain.Posts;
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
            .AddCors()
            .AddDefaultOptions()
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
        services.AddCors(options => options.AddDefaultPolicy(builder =>
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader()));
        return services;
    }

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IPostRepository, PostRepository>();
        services.AddScoped<ILikeRepository, LikeRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUsersClient, UsersClient>();
        return services;
    }
}