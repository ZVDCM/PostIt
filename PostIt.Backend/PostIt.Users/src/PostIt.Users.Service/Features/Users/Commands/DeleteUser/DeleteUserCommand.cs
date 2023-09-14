using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Users.Commands.DeleteUser;

public readonly record struct DeleteUserCommand(UserId UserId) : ICommand<Result<User>>;