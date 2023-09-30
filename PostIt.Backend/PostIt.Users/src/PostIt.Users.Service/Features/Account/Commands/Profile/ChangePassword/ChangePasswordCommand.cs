using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Profile.ChangePassword;

public readonly record struct ChangePasswordCommand(string AccessToken, string OldPassword, string NewPassword) : ICommand<Result>;