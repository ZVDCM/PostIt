using System;
using System.Threading;
using System.Threading.Tasks;
using BCrypt.Net;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Constants;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.Login;

public sealed class LoginCommandHandler : ICommandHandler<LoginCommand, Result<Tuple<User, Token>>>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;

    public LoginCommandHandler(IUserRepository userRepository, IUnitOfWork unitOfWork, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<Result<Tuple<User, Token>>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        User? user = await _userRepository.GetUserAsync(u => string.Equals(u.Email, request.Email), cancellationToken);
        if (user is null) return Result.Failure<Tuple<User, Token>>(Errors.Unauthorized);

        bool isMatch = BCrypt.Net.BCrypt.EnhancedVerify(request.Password, user.Password, HashType.SHA512);
        if (!isMatch) return Result.Failure<Tuple<User, Token>>(Errors.Unauthorized);

        var accessToken = _jwtService.GenerateAccessToken(user);
        user.DisableLatestRefreshToken();
        var refreshToken = _jwtService.GenerateRefreshToken(user);
        user.AddRefreshToken(refreshToken);

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ?
            Result.Success(Tuple.Create(user, accessToken)) :
            Result.Failure<Tuple<User, Token>>(TokenErrors.TokenNotCreated);
    }
}
