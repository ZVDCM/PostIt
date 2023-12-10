using System;

namespace PostIt.Contracts.Posts.Events.Likes;

public sealed record PostUnLiked(Guid PostId, Guid UserId, string Username);