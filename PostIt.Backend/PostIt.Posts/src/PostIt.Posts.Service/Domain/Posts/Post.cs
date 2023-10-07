using System;
using System.Collections.Generic;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Posts.Service.Domain.Comments;
using PostIt.Posts.Service.Domain.Likes;

namespace PostIt.Posts.Service.Domain.Posts;

public sealed class Post : Entity, IAuditable
{
    public PostId Id { get; private set; }
    public UserId UserId { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string Body { get; private set; } = string.Empty;
    public string Image { get; private set; } = string.Empty;
    public ICollection<Like> Likes { get; private set; } = new List<Like>();
    public ICollection<Comment> Comments { get; private set; } = new List<Comment>();
    public DateTime CreatedOnUtc { get; init; }
    public DateTime ModifiedOnUtc { get; init; }

    private Post(PostId id, UserId userId, string username, string body, string image)
    {
        Id = id;
        UserId = userId;
        Username = username;
        Body = body;
        Image = image;
    }

    public static Post Create(Guid userId, string username, string body, string image)
        => new(new PostId(Guid.NewGuid()), new UserId(userId), username, body, image);

    public void UpdateUsername(string username)
    {
        Username = username;
    }

    public void Update(string body, string image)
    {
        Body = body;
        Image = image;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Id;
    }

    private Post() { }
}