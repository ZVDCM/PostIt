using System;

namespace PostIt.Contracts.Posts.Responses;

public sealed record CommentResponse(
    Guid CommentId,
    Guid PostId,
    Guid UserId,
    string Username,
    string Comment,
    DateTime CreatedOnUtc,
    DateTime ModifiedOnUtc);