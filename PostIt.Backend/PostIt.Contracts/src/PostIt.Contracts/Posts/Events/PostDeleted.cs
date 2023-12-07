using System;

namespace PostIt.Contracts.Posts.Events;

public sealed record PostDeleted(Guid PostId, Guid UserId, string UserRole);