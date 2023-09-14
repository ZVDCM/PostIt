namespace PostIt.Contracts.Users.Requests.Account.VerifyEmail;

public sealed record VerifyForgotPasswordTokenRequest(string Email, string Token);