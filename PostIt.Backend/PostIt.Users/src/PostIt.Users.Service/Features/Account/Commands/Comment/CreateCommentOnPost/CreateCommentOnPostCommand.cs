using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Comment.CreateCommentOnPost;

public readonly record struct CreateCommentOnPostCommand(
    string AccessToken,
    PostId PostId,
    string Comment) : ICommand<Result>;