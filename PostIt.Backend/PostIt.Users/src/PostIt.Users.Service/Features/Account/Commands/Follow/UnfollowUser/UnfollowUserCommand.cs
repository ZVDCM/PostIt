using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Follow.UnfollowUser;

public readonly record struct UnfollowUserCommand(string AccessToken, UserId FollowUserId) : ICommand<Result>;