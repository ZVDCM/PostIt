using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Users.Commands.CreateUser;

public readonly record struct CreateUserCommand(User User) : ICommand<Result<User>>;