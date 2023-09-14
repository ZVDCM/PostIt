using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Queries.GetProfile;

public sealed class GetProfileQueryHandler : IQueryHandler<GetProfileQuery, Result<User>>
{
    private readonly IJwtService _jwtService;

    public GetProfileQueryHandler(IJwtService jwtService)
    {
        _jwtService = jwtService;
    }

    public async Task<Result<User>> Handle(GetProfileQuery request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure<User>(result.Error);

        User user = result.Value!;

        return Result.Success(user);
    }
}
