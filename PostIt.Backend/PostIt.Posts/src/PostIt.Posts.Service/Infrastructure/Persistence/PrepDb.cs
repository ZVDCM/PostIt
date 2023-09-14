using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PostIt.Posts.Service.Infrastructure.Persistence;
using Serilog;

namespace PostIt.Users.Service.Infrastructure.Persistence;

public static class PrepDb
{
    public static void MigrateDb(this WebApplication app)
    {
        using var serviceScope = app.Services.CreateScope();
        var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = serviceScope.ServiceProvider.GetRequiredService<ILogger>();

        if (app.Environment.IsDevelopment()) return;

        try
        {
            context.Database.Migrate();
        }
        catch (Exception ex)
        {
            logger.Debug(ex, "An error occurred while migrating the database.");
        }
    }
}