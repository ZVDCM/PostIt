using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Domain.Users;
using PostIt.Contracts.Users.Responses;

namespace PostIt.Posts.Service.Infrastructure.Client;
public interface IUsersClient
{
    Task<ProfileResponse?> GetUserProfileAsync(UserId userId, CancellationToken cancellationToken);
}