using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Logout;

public readonly record struct LogoutCommand(string AccessToken) : ICommand<Result>;