using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Users.Commands.DeleteUser;

public readonly record struct DeleteUserCommand(UserId UserId) : ICommand<Result<User>>;