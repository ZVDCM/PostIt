using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.Follow.UnfollowUser;
public sealed class UnfollowUserCommandHandler : ICommandHandler<UnfollowUserCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UnfollowUserCommandHandler(IJwtService jwtService, IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _jwtService = jwtService;
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(UnfollowUserCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;

        User? followedUser = await _userRepository.GetUserAsync(u => u.Id == request.FollowUserId, cancellationToken);
        if (followedUser is null) return Result.Failure(UserErrors.UserNotFound);

        user.UnfollowUser(followedUser);
        followedUser.UserUnfollowed(user);

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ?
            Result.Success() :
            Result.Failure(UserErrors.UserNotUpdated);
    }
}
