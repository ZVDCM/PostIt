using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Email.Command.EmailVerificationToken;

public readonly record struct EmailVerificationTokenCommand(User User, Token Token) : ICommand<Result>;