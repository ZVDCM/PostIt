using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Token;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.CreateForgotPasswordToken;

public sealed class CreateResetTokenCommandHandler : ICommandHandler<CreateResetTokenCommand, Result<Tuple<User, Token>>>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly TokenOptions _tokenOptions;

    public CreateResetTokenCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IOptions<TokenOptions> tokenOptions)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _tokenOptions = tokenOptions.Value;
    }

    public async Task<Result<Tuple<User, Token>>> Handle(CreateResetTokenCommand request, CancellationToken cancellationToken)
    {
        User? user = await _userRepository.GetUserAsync(u => u.Email == request.UserEmail, cancellationToken);
        if (user is null) return Result.Success<Tuple<User, Token>>();

        DateTime now = DateTime.UtcNow;
        Token token = Token.Create(user.Id, now, now.AddSeconds(_tokenOptions.SecondsForgotPasswordTokenExpiration));

        user.AddForgotPasswordToken(token);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result.Success(Tuple.Create(user, token));
    }
}
