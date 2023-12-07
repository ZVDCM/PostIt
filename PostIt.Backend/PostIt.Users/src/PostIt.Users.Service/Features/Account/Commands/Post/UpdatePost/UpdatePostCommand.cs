using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Post.UpdatePost;

public readonly record struct UpdatePostCommand(string AccessToken, PostId PostId, string Body) : ICommand<Result>;