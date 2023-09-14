using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Users.Commands.UpdateUser;

public readonly record struct UpdateUserCommand(UserId UserId, string Username, string Email, string Password) : ICommand<Result<User>>;
