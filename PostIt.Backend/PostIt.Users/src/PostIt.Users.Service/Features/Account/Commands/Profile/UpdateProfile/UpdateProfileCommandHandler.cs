using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Events.Users;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.Profile.UpdateProfile;

public sealed class UpdateProfileCommandHandler : ICommandHandler<UpdateProfileCommand, Result<User>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly IPublishEndpoint _publishEndpoint;

    public UpdateProfileCommandHandler(
        IUnitOfWork unitOfWork,
        IJwtService jwtService,
        IPublishEndpoint publishEndpoint)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result<User>> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure<User>(result.Error);

        User user = result.Value!;
        string oldUsername = user.Username;

        user.UpdateProfile(request.Username, request.Email);

        if (!string.Equals(oldUsername, request.Username))
            await _publishEndpoint.Publish(new UserChangedUsername(user.Id.Value, user.Username));

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ?
            Result.Success(user) :
            Result.Failure<User>(UserErrors.UserNotUpdated);
    }
}
