using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PostIt.Common.Domain.Likes;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Domain.Users;

namespace PostIt.Posts.Service.Infrastructure.Persistence.Configurations;

public sealed class LikeConfigurations : IEntityTypeConfiguration<Like>
{
    public void Configure(EntityTypeBuilder<Like> builder)
    {
        builder.HasKey(l => l.Id);
        builder.Property(l => l.Id)
            .HasConversion(
                l => l.Value,
                v => new LikeId(v));
        builder.Property(l => l.PostId)
            .HasConversion(
                p => p.Value,
                v => new PostId(v));
        builder.Property(l => l.UserId)
            .HasConversion(
                u => u.Value,
                v => new UserId(v));

        builder.HasOne(l => l.Post)
            .WithMany(p => p.Likes)
            .HasForeignKey(l => l.PostId);
    }
}
