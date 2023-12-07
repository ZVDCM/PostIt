using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;

namespace PostIt.Users.Service.Features.Users.Queries.GetUserById;

public sealed class GetUserByIdQueryHandler : IQueryHandler<GetUserByIdQuery, Result<User>>
{
    private readonly IUserRepository _userRepository;

    public GetUserByIdQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<User>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        User? user = await _userRepository.GetUserAsync(u => u.Id == request.UserId, cancellationToken);
        if (user is null) return Result.Failure<User>(UserErrors.UserNotFound);
        return Result.Success(user);
    }
}
