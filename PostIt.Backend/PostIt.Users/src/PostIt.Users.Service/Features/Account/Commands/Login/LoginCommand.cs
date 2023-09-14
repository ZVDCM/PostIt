using System;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Account.Commands.Login;

public readonly record struct LoginCommand(string Email, string Password) : ICommand<Result<Tuple<User, Token>>>;