using System;
using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Constants;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.VerifyForgotPasswordToken;

public sealed class VerifyForgotPasswordTokenCommandHandler : ICommandHandler<VerifyForgotPasswordTokenCommand, Result<Tuple<User, Token>>>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public VerifyForgotPasswordTokenCommandHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<Result<Tuple<User, Token>>> Handle(VerifyForgotPasswordTokenCommand request, CancellationToken cancellationToken)
    {
        User? user = await _userRepository.GetUserAsync(u => u.Email == request.UserEmail, cancellationToken);
        if (user is null) return Result.Failure<Tuple<User, Token>>(Errors.Unauthorized);

        Token? token = user.GetForgotPasswordToken(t => t.Value == request.ForgotPasswordToken);
        if (token is null) return Result.Failure<Tuple<User, Token>>(Errors.Unauthorized);

        var accessToken = _jwtService.GenerateAccessToken(user);

        return Result.Success(Tuple.Create(user, accessToken));
    }
}
