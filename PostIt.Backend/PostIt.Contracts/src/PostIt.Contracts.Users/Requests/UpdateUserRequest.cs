namespace PostIt.Contracts.Users.Requests;

public sealed record UpdateUserRequest(string Username, string Email, string Password);