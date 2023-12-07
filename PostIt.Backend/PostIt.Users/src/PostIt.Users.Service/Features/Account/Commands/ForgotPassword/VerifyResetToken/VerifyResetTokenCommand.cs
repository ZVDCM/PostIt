using System;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.VerifyResetToken;

public readonly record struct VerifyResetTokenCommand(string UserEmail, string ResetToken) : ICommand<Result<Tuple<User, Token>>>;