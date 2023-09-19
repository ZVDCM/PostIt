using System;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.CreateForgotPasswordToken;

public readonly record struct CreateResetTokenCommand(string UserEmail) : ICommand<Result<Tuple<User, Token>>>;