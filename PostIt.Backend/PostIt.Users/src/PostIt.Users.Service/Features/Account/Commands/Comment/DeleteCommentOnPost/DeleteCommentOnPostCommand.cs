using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Comment.DeleteCommentOnPost;

public readonly record struct DeleteCommentOnPostCommand(
    string AccessToken,
    PostId PostId,
    CommentId CommentId) : ICommand<Result>;