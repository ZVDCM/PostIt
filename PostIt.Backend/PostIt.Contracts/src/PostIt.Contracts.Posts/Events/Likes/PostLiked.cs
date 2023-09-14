using System;

namespace PostIt.Contracts.Posts.Events.Likes;

public sealed record PostLiked(Guid PostId, Guid UserId, string Username);