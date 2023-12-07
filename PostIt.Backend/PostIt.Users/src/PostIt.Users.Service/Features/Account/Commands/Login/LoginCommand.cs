using System;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Login;

public readonly record struct LoginCommand(string Email, string Password) : ICommand<Result<Tuple<User, Token>>>;