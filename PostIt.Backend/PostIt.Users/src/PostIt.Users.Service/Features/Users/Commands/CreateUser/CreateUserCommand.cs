using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Users.Commands.CreateUser;

public readonly record struct CreateUserCommand(User User) : ICommand<Result<User>>;