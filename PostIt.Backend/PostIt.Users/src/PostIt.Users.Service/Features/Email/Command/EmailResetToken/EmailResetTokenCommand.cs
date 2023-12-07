using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Email.Command.EmailResetToken;

public readonly record struct EmailResetTokenCommand(User? User, Token? Token) : ICommand<Result>;