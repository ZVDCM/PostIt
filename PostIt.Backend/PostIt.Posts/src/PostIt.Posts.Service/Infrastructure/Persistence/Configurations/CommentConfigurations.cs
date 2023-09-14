using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PostIt.Common.Identifiers;
using PostIt.Posts.Service.Domain.Comments;

namespace PostIt.Posts.Service.Infrastructure.Persistence.Configurations;

public sealed class CommentConfigurations : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id)
            .HasConversion(
                c => c.Value,
                v => new CommentId(v));
        builder.Property(l => l.PostId)
            .HasConversion(
                p => p.Value,
                v => new PostId(v));
        builder.Property(c => c.UserId)
            .HasConversion(
                u => u.Value,
                v => new UserId(v));

        builder.HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PostId);
    }
}
