namespace PostIt.Contracts.Users.Requests.Account;

public sealed record LoginRequest(string Email, string Password);