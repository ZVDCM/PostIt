namespace PostIt.Contracts.Users.Responses;

public sealed record LoginResponse(string AccessToken, ProfileResponse User);