using System;

namespace PostIt.Contracts.Posts.Responses;

public sealed record LikeResponse(
    Guid LikeId,
    Guid PostId,
    Guid UserId,
    string Username,
    DateTime CreatedOnUtc);