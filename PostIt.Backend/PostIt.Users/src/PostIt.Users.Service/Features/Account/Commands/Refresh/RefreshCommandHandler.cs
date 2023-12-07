using System;
using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Constants;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.Refresh;

public sealed class RefreshCommandHandler : ICommandHandler<RefreshCommand, Result<Tuple<User, Token>>>
{
    private readonly IJwtService _jwtService;
    private readonly IUnitOfWork _unitOfWork;
    public RefreshCommandHandler(IJwtService jwtService, IUnitOfWork unitOfWork)
    {
        _jwtService = jwtService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Tuple<User, Token>>> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure<Tuple<User, Token>>(Errors.Unauthorized);

        User user = result.Value!;

        Token? latestRefreshToken = user.GetLatestRefreshToken();
        if (latestRefreshToken is null ||
            latestRefreshToken.IsDisabled ||
            latestRefreshToken.IsExpired())
        {
            return Result.Failure<Tuple<User, Token>>(Errors.Unauthorized);
        }

        Result<DateTime> nbfDateTimeResult = _jwtService.GetNbfDateTime(request.AccessToken);
        if (nbfDateTimeResult.IsFailure ||
            nbfDateTimeResult.Value != latestRefreshToken.IssuedAt.Date)
        {
            return Result.Failure<Tuple<User, Token>>(Errors.Unauthorized);
        }

        Token accessToken = _jwtService.GenerateAccessToken(user);
        latestRefreshToken.Disable();
        Token refreshToken = _jwtService.GenerateRefreshToken(user);
        user.AddRefreshToken(refreshToken);

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ?
            Result.Success(Tuple.Create(user, accessToken)) :
            Result.Failure<Tuple<User, Token>>(TokenErrors.TokenNotCreated);
    }
}
