using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Identifiers;
using PostIt.Contracts.Users.Responses;

namespace PostIt.Posts.Service.Infrastructure.Client;

public sealed class UsersClient : IUsersClient
{
    private readonly HttpClient _httpClient;

    public UsersClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ProfileResponse?> GetUserProfileAsync(UserId userId, CancellationToken cancellationToken)
        => await _httpClient.GetFromJsonAsync<ProfileResponse>($"/api/account/profile/{userId.Value}", cancellationToken);
}