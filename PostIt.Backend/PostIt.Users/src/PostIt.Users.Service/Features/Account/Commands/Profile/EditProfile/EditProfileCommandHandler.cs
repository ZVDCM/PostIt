using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Events.Users;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Infrastructure.Authentication;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Account.Commands.Profile.EditProfile;

public sealed class EditProfileCommandHandler : ICommandHandler<EditProfileCommand, Result<User>>
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly IPublishEndpoint _publishEndpoint;

    public EditProfileCommandHandler(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IJwtService jwtService,
        IPublishEndpoint publishEndpoint)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _publishEndpoint = publishEndpoint;
        _userRepository = userRepository;
    }

    public async Task<Result<User>> Handle(EditProfileCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure<User>(result.Error);

        User user = result.Value!;

        User? userTemp = await _userRepository.GetUserAsync(u => u.Email == request.Email, cancellationToken);
        if (userTemp is not null) return Result.Failure<User>(UserErrors.UserAlreadyExists);

        string oldUsername = user.Username;
        string oldEmail = user.Email;

        user.EditProfile(request.Username, request.Email);

        if (!string.Equals(oldEmail, request.Email)) user.UnverifyEmail();

        if (!string.Equals(oldUsername, request.Username))
        {
            await _publishEndpoint.Publish(new UserChangedUsername(user.Id.Value, user.Username));
        }

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ?
            Result.Success(user) :
            Result.Failure<User>(UserErrors.UserNotUpdated);
    }
}
