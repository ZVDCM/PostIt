using System;

namespace PostIt.Contracts.Posts.Events;

public sealed record PostUpdated(Guid PostId, Guid UserId, string Body, string Image, byte[] FileBytes);