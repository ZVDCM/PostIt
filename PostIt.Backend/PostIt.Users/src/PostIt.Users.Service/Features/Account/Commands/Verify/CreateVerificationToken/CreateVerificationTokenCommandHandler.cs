using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Token;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.Verify.CreateVerificationToken;

public sealed class CreateVerificationTokenCommandHandler : ICommandHandler<CreateVerificationTokenCommand, Result<Tuple<User, Token>>>
{
    private readonly IJwtService _jwtService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly TokenOptions _tokenOptions;

    public CreateVerificationTokenCommandHandler(
        IJwtService jwtService,
        IUnitOfWork unitOfWork,
        IOptions<TokenOptions> tokenOptions)
    {
        _jwtService = jwtService;
        _unitOfWork = unitOfWork;
        _tokenOptions = tokenOptions.Value;
    }

    public async Task<Result<Tuple<User, Token>>> Handle(CreateVerificationTokenCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure<Tuple<User, Token>>(result.Error);

        User user = result.Value!;

        DateTime now = DateTime.UtcNow;
        Token token = Token.Create(user.Id, now, now.AddSeconds(_tokenOptions.SecondsVerificationTokenExpiration));

        user.AddVerificationToken(token);

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ?
            Result.Success(Tuple.Create(user, token)) :
            Result.Failure<Tuple<User, Token>>(TokenErrors.TokenNotCreated);
    }
}
