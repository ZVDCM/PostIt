using System;

namespace PostIt.Contracts.Posts.Events;

public sealed record PostCreated(Guid UserId, string Username, string Body);