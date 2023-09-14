using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Email.Command.EmailVerificationToken;

public readonly record struct EmailVerificationTokenCommand(User User, Token Token) : ICommand<Result>;