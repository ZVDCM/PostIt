namespace PostIt.Contracts.Users.Requests.Account.ForgotPassword;

public sealed record VerifyResetTokenRequest(string Email, string Token);