using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Verify.VerifyEmail;

public readonly record struct VerifyEmailCommand(string AccessToken, string VerificationToken) : ICommand<Result>;