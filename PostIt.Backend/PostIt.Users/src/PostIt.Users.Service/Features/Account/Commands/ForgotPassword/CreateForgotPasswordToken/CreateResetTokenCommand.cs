using System;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.CreateForgotPasswordToken;

public readonly record struct CreateResetTokenCommand(string UserEmail) : ICommand<Result<Tuple<User, Token>>>;