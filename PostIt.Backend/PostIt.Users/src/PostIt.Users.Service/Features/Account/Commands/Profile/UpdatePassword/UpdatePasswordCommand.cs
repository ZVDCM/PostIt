using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Profile.UpdatePassword;

public readonly record struct UpdatePasswordCommand(string AccessToken, string OldPassword, string NewPassword) : ICommand<Result>;