namespace PostIt.Contracts.Users.Requests.Account;

public sealed record UpdatePasswordRequest(string OldPassword, string NewPassword);