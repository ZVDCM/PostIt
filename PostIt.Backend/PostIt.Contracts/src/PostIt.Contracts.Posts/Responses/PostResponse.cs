using System;
using System.Collections.Generic;

namespace PostIt.Contracts.Posts.Responses;

public sealed record PostResponse(
    Guid PostId,
    Guid UserId,
    string Username,
    string Title,
    string Image,
    DateTime CreatedOnUtc,
    DateTime ModifiedOnUtc,
    int LikesCount,
    int CommentsCount);