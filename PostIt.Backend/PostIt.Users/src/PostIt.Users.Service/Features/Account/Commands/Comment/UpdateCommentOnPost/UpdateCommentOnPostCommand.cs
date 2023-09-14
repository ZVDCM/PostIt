using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Comment.UpdateCommentOnPost;

public readonly record struct UpdateCommentOnPostCommand(
    string AccessToken,
    PostId PostId,
    CommentId CommentId,
    string Comment) : ICommand<Result>;