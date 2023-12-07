using System;

namespace PostIt.Contracts.Posts.Events.Users;

public sealed record UserChangedUsername(Guid UserId, string NewUsername);