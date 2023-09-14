using System;
using System.Collections.Generic;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Posts.Service.Domain.Posts;

namespace PostIt.Posts.Service.Domain.Likes;

public sealed class Like : Entity, IAuditable
{
    public LikeId Id { get; private set; }
    public PostId PostId { get; private set; }
    public Post Post { get; private set; } = null!;
    public UserId UserId { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public DateTime CreatedOnUtc { get; init; }
    public DateTime ModifiedOnUtc { get; init; }

    private Like(LikeId id, PostId postId, UserId userId, string username)
    {
        Id = id;
        PostId = postId;
        UserId = userId;
        Username = username;
    }

    public static Like Create(PostId postId, UserId userId, string username)
        => new(new LikeId(Guid.NewGuid()), postId, userId, username);

    public void UpdateUsername(string username)
    {
        Username = username;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Id;
    }

    private Like() { }
}