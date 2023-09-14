using System;

namespace PostIt.Contracts.Posts.Events.Likes;

public sealed record PostUnliked(Guid PostId, Guid UserId);