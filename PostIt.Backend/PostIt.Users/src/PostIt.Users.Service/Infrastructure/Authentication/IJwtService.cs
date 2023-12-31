using System;
using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Infrastructure.Authentication;

public interface IJwtService
{
    Token GenerateAccessToken(User user);
    Token GenerateRefreshToken(User user);
    Result<UserId> GetUserId(string accessToken);
    Result<DateTime> GetNbfDateTime(string accessToken);
    Task<Result<User>> GetUserAsync(string accessToken, CancellationToken cancellationToken);
}