using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Like.UnlikePost;

public readonly record struct UnlikePostCommand(string AccessToken, PostId PostId) : ICommand<Result>;