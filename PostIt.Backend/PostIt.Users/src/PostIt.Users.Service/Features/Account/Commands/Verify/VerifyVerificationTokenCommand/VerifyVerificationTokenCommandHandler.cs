using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.Verify.VerifyVerificationTokenCommand;

public sealed class VerifyVerificationTokenCommandHandler : ICommandHandler<VerifyVerificationTokenCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IUnitOfWork _unitOfWork;

    public VerifyVerificationTokenCommandHandler(
        IJwtService jwtService,
        IUnitOfWork unitOfWork)
    {
        _jwtService = jwtService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(VerifyVerificationTokenCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;

        Token? verificationToken = user.GetVerificationToken(t => t.Value == request.VerificationToken);
        if (verificationToken is null) return Result.Failure(TokenErrors.TokenNotFound);
        if (verificationToken.IsDisabled) return Result.Failure(TokenErrors.TokenExpired);
        if (verificationToken.IsExpired())
        {
            verificationToken.Disable();
            return Result.Failure(TokenErrors.TokenExpired);
        }
        user.VerifyEmail();
        user.DisableToken(verificationToken);

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ?
            Result.Success() :
            Result.Failure(UserErrors.UserNotUpdated);
    }
}
