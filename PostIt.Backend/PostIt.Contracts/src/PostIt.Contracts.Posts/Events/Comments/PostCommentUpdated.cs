using System;

namespace PostIt.Contracts.Posts.Events.Comments;

public sealed record PostCommentUpdated(Guid PostId, Guid UserId, Guid CommentId, string Comment);