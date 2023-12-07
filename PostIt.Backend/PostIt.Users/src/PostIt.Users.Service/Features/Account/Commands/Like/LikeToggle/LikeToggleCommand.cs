using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Like.LikeToggle;

public readonly record struct LikeToggleCommand(string AccessToken, PostId PostId) : ICommand<Result>;