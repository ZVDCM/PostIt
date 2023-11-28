using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Like.LikeToggle;

public readonly record struct LikeToggleCommand(string AccessToken, PostId PostId) : ICommand<Result>;