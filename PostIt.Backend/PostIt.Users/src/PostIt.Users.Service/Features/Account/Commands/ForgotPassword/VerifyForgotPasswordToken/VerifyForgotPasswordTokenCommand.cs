using System;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.VerifyForgotPasswordToken;

public readonly record struct VerifyForgotPasswordTokenCommand(string UserEmail, string ForgotPasswordToken) : ICommand<Result<Tuple<User, Token>>>;