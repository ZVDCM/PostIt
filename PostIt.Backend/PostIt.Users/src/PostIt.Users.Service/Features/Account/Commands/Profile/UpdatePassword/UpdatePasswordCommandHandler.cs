using System.Threading;
using System.Threading.Tasks;
using BCrypt.Net;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.Profile.UpdatePassword;

public sealed class UpdatePasswordCommandHandler : ICommandHandler<UpdatePasswordCommand, Result>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;

    public UpdatePasswordCommandHandler(
        IUnitOfWork unitOfWork,
        IJwtService jwtService)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<Result> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;

        bool isMatch = BCrypt.Net.BCrypt.EnhancedVerify(request.OldPassword, user.Password, HashType.SHA512);
        if (!isMatch) return Result.Failure(UserErrors.UserForbidden);

        user.UpdatePassword(request.NewPassword);

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ?
            Result.Success() :
            Result.Failure(UserErrors.UserNotUpdated);
    }
}
