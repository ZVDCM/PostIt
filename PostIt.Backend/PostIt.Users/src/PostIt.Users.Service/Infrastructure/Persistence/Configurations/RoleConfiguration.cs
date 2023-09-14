using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PostIt.Common.Identifiers;
using PostIt.Users.Service.Domain.Roles;

namespace PostIt.Users.Service.Infrastructure.Persistence.Configurations;

public sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasConversion(
            r => r.Value,
            v => new RoleId(v));

        builder.HasMany(r => r.Users)
            .WithOne(u => u.Role)
            .HasForeignKey(u => u.Id);

        var roleNavigation = builder.Metadata.FindNavigation(nameof(Role.Users));
        roleNavigation?.SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}