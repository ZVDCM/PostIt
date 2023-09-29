using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Users.Commands.UpdateUser;

public sealed class UpdateUserCommandHandler : ICommandHandler<UpdateUserCommand, Result<User>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserRepository _userRepository;

    public UpdateUserCommandHandler(IUnitOfWork unitOfWork, IUserRepository userRepository)
    {
        _unitOfWork = unitOfWork;
        _userRepository = userRepository;
    }

    public async Task<Result<User>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        User? user = await _userRepository.GetUserAsync(u => u.Id == request.UserId, cancellationToken);
        if (user is null) return Result.Failure<User>(UserErrors.UserNotFound);

        User? userTemp = await _userRepository.GetUserAsync(u => u.Email == request.Email, cancellationToken);
        if (userTemp is not null) return Result.Failure<User>(UserErrors.UserAlreadyExists);

        string oldEmail = user.Email;
        
        user.UpdateProfile(request.Username, request.Email);

        if (!string.Equals(oldEmail, request.Email)) user.UnverifyEmail();

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ? user : Result.Failure<User>(UserErrors.UserNotUpdated);
    }
}
