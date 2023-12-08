using System;

namespace PostIt.Contracts.Users.Responses;

public sealed record ProfileResponse(
    Guid Id,
    string Username,
    string Email,
    bool IsVerified,
    string Role,
    DateTime CreatedOnUtc);