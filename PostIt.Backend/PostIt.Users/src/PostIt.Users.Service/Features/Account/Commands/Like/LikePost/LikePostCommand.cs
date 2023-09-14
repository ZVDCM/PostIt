using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Like.LikePost;

public readonly record struct LikePostCommand(string AccessToken, PostId PostId) : ICommand<Result>;