using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Post.CreatePost;

public readonly record struct CreatePostCommand(
    string AccessToken,
    string Body) : ICommand<Result>;