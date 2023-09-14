using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.Follow.FollowUser;

public sealed class FollowUserCommandHandler : ICommandHandler<FollowUserCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork unitOfWork;

    public FollowUserCommandHandler(IJwtService jwtService, IUserRepository userRepository, IUnitOfWork unitOfWork)
    {
        _jwtService = jwtService;
        _userRepository = userRepository;
        this.unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(FollowUserCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;

        User? followUser = await _userRepository.GetUserAsync(u => u.Id == request.FollowUserId, cancellationToken);
        if (followUser is null) return Result.Failure(UserErrors.UserNotFound);

        user.FollowUser(followUser);
        followUser.UserFollowed(user);

        return await unitOfWork.SaveChangesAsync(cancellationToken) ?
            Result.Success() :
            Result.Failure(UserErrors.UserNotUpdated);
    }
}
