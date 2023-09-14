using System;
using System.Collections.Generic;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Posts.Service.Domain.Posts;

namespace PostIt.Posts.Service.Domain.Comments;

public sealed class Comment : Entity, IAuditable
{
    public CommentId Id { get; private set; }
    public PostId PostId { get; private set; }
    public Post Post { get; private set; } = null!;
    public UserId UserId { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string Value { get; private set; } = string.Empty;
    public DateTime CreatedOnUtc { get; init; }
    public DateTime ModifiedOnUtc { get; init; }

    private Comment(CommentId commentId, PostId postId, UserId userId, string username, string value)
    {
        Id = commentId;
        PostId = postId;
        UserId = userId;
        Username = username;
        Value = value;
    }

    public static Comment Create(PostId postId, UserId userId, string username, string value)
        => new(new CommentId(Guid.NewGuid()), postId, userId, username, value);

    public void UpdateUsername(string username)
    {
        Username = username;
    }

    public void Update(string value)
    {
        Value = value;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Id;
    }

    private Comment() { }
}