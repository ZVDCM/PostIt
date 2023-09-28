using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using PostIt.Users.Service;
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
    app.UseSerilogRequestLogging();
    app.UseHttpsRedirection();
    app.UseExceptionHandler("/api/error");
    app.MapControllers();
    app.UseAuthentication();
    app.UseAuthorization();
    app.UseCors();
    app.MigrateDb();

    app.Run();
}
