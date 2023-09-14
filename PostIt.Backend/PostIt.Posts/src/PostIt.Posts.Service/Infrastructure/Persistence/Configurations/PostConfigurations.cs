using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PostIt.Common.Identifiers;
using PostIt.Posts.Service.Domain.Posts;

namespace PostIt.Posts.Service.Infrastructure.Persistence.Configurations;

public sealed class PostConfigurations : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id)
            .HasConversion(
                p => p.Value,
                v => new PostId(v));
        builder.Property(p => p.UserId)
            .HasConversion(
                u => u.Value,
                v => new UserId(v));

        builder.HasMany(p => p.Likes)
            .WithOne(l => l.Post)
            .HasForeignKey(l => l.PostId);

        builder.HasMany(p => p.Comments)
            .WithOne(c => c.Post)
            .HasForeignKey(c => c.PostId);
    }
}
