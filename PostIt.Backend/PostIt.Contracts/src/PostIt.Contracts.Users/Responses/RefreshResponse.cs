namespace PostIt.Contracts.Users.Responses;

public sealed record RefreshResponse(string AccessToken, ProfileResponse User);