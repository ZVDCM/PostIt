using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PostIt.Common.Identifiers;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Infrastructure.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).HasConversion(
            u => u.Value,
            v => new UserId(v));

        builder.HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId);

        builder.OwnsMany(u => u.RefreshTokens, tb =>
        {
            tb.WithOwner().HasForeignKey(t => t.UserId);
            tb.Property(u => u.UserId).HasConversion(
                u => u.Value,
                v => new UserId(v));
        });

        builder.OwnsMany(u => u.ForgotPasswordTokens, tb =>
        {
            tb.WithOwner().HasForeignKey(t => t.UserId);
            tb.Property(u => u.UserId).HasConversion(
                u => u.Value,
                v => new UserId(v));
        });

        builder.OwnsMany(u => u.VerificationTokens, tb =>
        {
            tb.WithOwner().HasForeignKey(t => t.UserId);
            tb.Property(u => u.UserId).HasConversion(
                u => u.Value,
                v => new UserId(v));
        });

        var refreshTokenNavigation = builder.Metadata.FindNavigation(nameof(User.RefreshTokens));
        refreshTokenNavigation?.SetPropertyAccessMode(PropertyAccessMode.Field);

        var forgotPasswordTokenNavigation = builder.Metadata.FindNavigation(nameof(User.ForgotPasswordTokens));
        forgotPasswordTokenNavigation?.SetPropertyAccessMode(PropertyAccessMode.Field);

        var verificationTokenNavigation = builder.Metadata.FindNavigation(nameof(User.VerificationTokens));
        verificationTokenNavigation?.SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}
