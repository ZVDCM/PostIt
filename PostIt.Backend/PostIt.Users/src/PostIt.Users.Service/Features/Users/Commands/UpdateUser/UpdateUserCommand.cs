using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Users.Commands.UpdateUser;

public readonly record struct UpdateUserCommand(UserId UserId, string Username, string Email, string Password) : ICommand<Result<User>>;
