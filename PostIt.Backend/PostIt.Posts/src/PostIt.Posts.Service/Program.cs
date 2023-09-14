using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using PostIt.Posts.Service;
using PostIt.Users.Service.Infrastructure.Persistence;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();

    builder.Host.UseSerilog((context, configuration) =>
        configuration.ReadFrom.Configuration(context.Configuration));

    builder.Services.AddDependencies();
}

var app = builder.Build();
{
    app.UseStaticFiles();
    app.UseSerilogRequestLogging();
    app.UseHttpsRedirection();
    app.UseExceptionHandler("/api/error");
    app.MapControllers();
    app.MigrateDb();

    app.Run();
}

