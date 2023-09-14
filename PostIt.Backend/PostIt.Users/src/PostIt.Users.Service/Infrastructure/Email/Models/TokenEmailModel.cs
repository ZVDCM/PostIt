namespace PostIt.Users.Service.Infrastructure.Email.Models;

public sealed record TokenEmailModel(string Username, string Title, string Token);