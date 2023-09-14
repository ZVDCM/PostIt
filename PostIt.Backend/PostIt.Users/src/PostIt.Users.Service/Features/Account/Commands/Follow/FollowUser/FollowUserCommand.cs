using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Follow.FollowUser;

public readonly record struct FollowUserCommand(string AccessToken, UserId FollowUserId) : ICommand<Result>;