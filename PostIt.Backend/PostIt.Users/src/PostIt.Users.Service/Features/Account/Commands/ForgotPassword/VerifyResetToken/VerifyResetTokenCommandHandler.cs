using System;
using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Constants;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.VerifyResetToken;

public sealed class VerifyResetTokenCommandHandler : ICommandHandler<VerifyResetTokenCommand, Result<Tuple<User, Token>>>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public VerifyResetTokenCommandHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<Result<Tuple<User, Token>>> Handle(VerifyResetTokenCommand request, CancellationToken cancellationToken)
    {
        User? user = await _userRepository.GetUserAsync(u => u.Email == request.UserEmail, cancellationToken);
        if (user is null) return Result.Failure<Tuple<User, Token>>(Errors.Unauthorized);

        Token? token = user.GetForgotPasswordToken(t => t.Value == request.ResetToken);
        if (token is null) return Result.Failure<Tuple<User, Token>>(Errors.Unauthorized);

        var accessToken = _jwtService.GenerateAccessToken(user);

        return Result.Success(Tuple.Create(user, accessToken));
    }
}
