namespace PostIt.Contracts.Users.Requests.Account;

public sealed record ChangePasswordRequest(string OldPassword, string NewPassword);