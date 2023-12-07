namespace PostIt.Contracts.Users.Requests.Account;

public sealed record RegisterRequest(string Username, string Email, string Password);