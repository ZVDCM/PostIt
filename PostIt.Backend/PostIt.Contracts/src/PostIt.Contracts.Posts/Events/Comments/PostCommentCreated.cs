using System;

namespace PostIt.Contracts.Posts.Events.Comments;

public sealed record PostCommentCreated(Guid PostId, Guid UserId, string Username, string Comment);