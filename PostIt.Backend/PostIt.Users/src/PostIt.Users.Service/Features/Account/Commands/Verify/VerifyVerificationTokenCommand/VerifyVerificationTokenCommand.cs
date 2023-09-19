using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Verify.VerifyVerificationTokenCommand;

public readonly record struct VerifyVerificationTokenCommand(string AccessToken, string VerificationToken) : ICommand<Result>;