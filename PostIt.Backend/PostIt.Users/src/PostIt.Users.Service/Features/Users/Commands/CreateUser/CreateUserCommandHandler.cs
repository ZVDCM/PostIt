using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Constants;
using PostIt.Common.Domain.Roles;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

namespace PostIt.Users.Service.Features.Users.Commands.CreateUser;

public sealed class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, Result<User>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IRoleRepository _roleRepository;
    private readonly IUserRepository _userRepository;

    public CreateUserCommandHandler(IUnitOfWork unitOfWork, IRoleRepository roleRepository, IUserRepository userRepository)
    {
        _unitOfWork = unitOfWork;
        _roleRepository = roleRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<User>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var role = await _roleRepository.GetRoleAsync(r => r.Value == RoleConstants.User, cancellationToken);
        if (role is null) return Result.Failure<User>(RoleErrors.RoleNotFound);

        User? user = await _userRepository.GetUserAsync(u => u.Email == request.User.Email, cancellationToken);
        if (user is not null) return Result.Failure<User>(UserErrors.UserAlreadyExists);
        user = request.User;

        user.UpdateRole(role);

        await _userRepository.CreateAsync(user, cancellationToken);

        return await _unitOfWork.SaveChangesAsync(cancellationToken) ? Result.Success(user) : Result.Failure<User>(UserErrors.UserNotCreated);
    }
}