using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Post.DeletePost;

public readonly record struct DeletePostCommand(string AccessToken, PostId PostId) : ICommand<Result>;