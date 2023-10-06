using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Account.Queries.GetUserProfile;

public sealed class GetUserProfileQueryHandler : IQueryHandler<GetUserProfileQuery, Result<User>>
{
    private readonly IUserRepository _userRepository;

    public GetUserProfileQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<User>> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
    {
        User? user = await _userRepository.GetUserAsync(u => u.Username == request.Username, cancellationToken);
        if (user is null) return Result.Failure<User>(UserErrors.UserNotFound);
        return Result.Success(user);
    }
}
