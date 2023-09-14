using System;
using System.Diagnostics;

namespace PostIt.Contracts.Posts.Events.Comments;

public sealed record PostCommentDeleted(Guid PostId, Guid UserId, Guid CommentId, string UserRole);