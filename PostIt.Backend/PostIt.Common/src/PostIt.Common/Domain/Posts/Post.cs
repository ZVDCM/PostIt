using System;
using System.Collections.Generic;
using PostIt.Common.Domain.Likes;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives;

namespace PostIt.Common.Domain.Posts;

public sealed class Post : Entity, IAuditable
{
    public PostId Id { get; private set; }
    public UserId UserId { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string Body { get; private set; } = string.Empty;
    public ICollection<Like> Likes { get; private set; } = new List<Like>();
    public DateTime CreatedOnUtc { get; init; }
    public DateTime ModifiedOnUtc { get; init; }

    private Post(PostId id, UserId userId, string username, string body)
    {
        Id = id;
        UserId = userId;
        Username = username;
        Body = body;
    }

    public static Post Create(Guid userId, string username, string body)
        => new(new PostId(Guid.NewGuid()), new UserId(userId), username, body);

    public void UpdateUsername(string username)
    {
        Username = username;
    }

    public void Update(string body)
    {
        Body = body;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Id;
    }

    private Post() { }
}