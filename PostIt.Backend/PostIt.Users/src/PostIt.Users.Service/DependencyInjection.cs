using System.IO;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using PostIt.Common;
using PostIt.Users.Service.Domain.Roles;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Jwt;
using PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Token;
using PostIt.Users.Service.Infrastructure.Authorization;
using PostIt.Users.Service.Infrastructure.Authorization.AuthorizationHandler;
using PostIt.Users.Service.Infrastructure.Email;
using PostIt.Users.Service.Infrastructure.Email.Configurations.Options;
using PostIt.Users.Service.Infrastructure.Persistence;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;
using PostIt.Users.Service.Infrastructure.Repositories;

namespace PostIt.Users.Service;

public static class DependencyInjection
{
    public static IServiceCollection AddDependencies(this IServiceCollection services)
    {
        services
            .AddHttpContextAccessor()
            .AddCors()
            .AddDefaultOptions()
            .AddOptions()
            .AddAuthentication()
            .AddAuthorization()
            .AddPolicyProvider()
            .AddAuthorizationHandler()
            .AddDbContext<ApplicationDbContext>()
            .AddMapper()
            .AddMediatr()
            .AddValidators()
            .AddEmail()
            .AddRabbitMq()
            .AddServices();

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
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddTransient<IJwtService, JwtService>();
        services.AddTransient<IEmailSender, EmailSender>();
        return services;
    }

    private static IServiceCollection AddOptions(this IServiceCollection services)
    {
        services.ConfigureOptions<JwtOptionsSetup>();
        services.ConfigureOptions<JwtBearerOptionsSetup>();
        services.ConfigureOptions<EmailOptionsSetup>();
        services.ConfigureOptions<TokenOptionsSetup>();
        return services;
    }

    private static IServiceCollection AddAuthentication(this IServiceCollection services)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
        return services;
    }

    private static IServiceCollection AddAuthorizationHandler(this IServiceCollection services)
    {
        services.AddTransient<IAuthorizationHandler, AuthorizationHandler>();
        return services;
    }

    private static IServiceCollection AddPolicyProvider(this IServiceCollection services)
    {
        services.AddTransient<IAuthorizationPolicyProvider, AuthorizationPolicyProvider>();
        return services;
    }

    private static IServiceCollection AddEmail(this IServiceCollection services)
    {
        var serviceProvider = services.BuildServiceProvider();
        var emailOptions = serviceProvider.GetRequiredService<IOptions<EmailOptions>>().Value;
        services
            .AddFluentEmail(emailOptions.DefaultFrom)
            .AddSendGridSender(emailOptions.SendGridApiKey)
            .AddRazorRenderer(Directory.GetCurrentDirectory());
        return services;
    }
}