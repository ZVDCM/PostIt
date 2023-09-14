using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Infrastructure.Email;

namespace PostIt.Users.Service.Features.Email.Command.EmailVerificationToken;

public sealed class EmailVerificationTokenCommandHandler : ICommandHandler<EmailVerificationTokenCommand, Result>
{
    private readonly IEmailSender _emailSender;

    public EmailVerificationTokenCommandHandler(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    public async Task<Result> Handle(EmailVerificationTokenCommand request, CancellationToken cancellationToken)
    {
        bool IsSuccessful = await _emailSender.EmailVerificationTokenAsync(request.User, request.Token, cancellationToken);
        if (IsSuccessful) return Result.Success();
        return Result.Failure(EmailErrors.EmailNotSent);
    }
}
