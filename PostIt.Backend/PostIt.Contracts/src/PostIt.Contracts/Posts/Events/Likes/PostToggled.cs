using System;

namespace PostIt.Contracts.Posts.Events.Likes;

public sealed record PostToggled(Guid PostId, Guid UserId, string Username);