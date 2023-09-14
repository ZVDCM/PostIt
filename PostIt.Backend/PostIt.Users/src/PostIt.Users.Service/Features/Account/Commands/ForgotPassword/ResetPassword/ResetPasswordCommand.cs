using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.ResetPassword;

public readonly record struct ResetPasswordCommand(string AccessToken, string NewPassword) : ICommand<Result>;