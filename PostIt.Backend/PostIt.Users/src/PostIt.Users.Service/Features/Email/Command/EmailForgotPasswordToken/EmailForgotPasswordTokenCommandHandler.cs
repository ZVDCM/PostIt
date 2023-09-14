using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Infrastructure.Email;

namespace PostIt.Users.Service.Features.Email.Command.EmailForgotPasswordToken;

public sealed class EmailForgotPasswordTokenCommandHandler : ICommandHandler<EmailForgotPasswordTokenCommand, Result>
{
    private readonly IEmailSender _emailSender;

    public EmailForgotPasswordTokenCommandHandler(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    public async Task<Result> Handle(EmailForgotPasswordTokenCommand request, CancellationToken cancellationToken)
    {
        if (request.User is null || request.Token is null) return Result.Success();
        await _emailSender.EmailForgotPasswordTokenAsync(request.User, request.Token, cancellationToken);
        return Result.Success();
    }
}


