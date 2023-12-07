namespace PostIt.Contracts.Users.Requests.Account;
public sealed record EditProfileRequest(string Username, string Email);