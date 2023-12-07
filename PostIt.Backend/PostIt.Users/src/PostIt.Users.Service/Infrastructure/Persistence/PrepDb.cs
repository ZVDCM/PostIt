using System;
using BCrypt.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PostIt.Common.Constants;
using PostIt.Common.Domain.Roles;
using PostIt.Common.Domain.Users;
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

    public static ModelBuilder SeedDb(this ModelBuilder builder)
    {
        Role userRole = Role.Create(RoleConstants.User);
        Role adminRole = Role.Create(RoleConstants.Admin);

        builder.Entity<Role>().HasData(userRole, adminRole);

        User user = User.Create(
            "JuanDelaCruz",
            "juandelacruz@gmail.com",
            BCrypt.Net.BCrypt.EnhancedHashPassword("TestTest!23", HashType.SHA512, 13),
            DateTime.UtcNow);
        user.UpdateRole(adminRole);
        user.VerifyEmail();

        builder.Entity<User>().HasData(user);

        return builder;
    }
}