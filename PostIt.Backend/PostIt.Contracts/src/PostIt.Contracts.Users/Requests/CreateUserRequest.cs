namespace PostIt.Contracts.Users.Requests;

public sealed record CreateUserRequest(string Username, string Email, string Password);