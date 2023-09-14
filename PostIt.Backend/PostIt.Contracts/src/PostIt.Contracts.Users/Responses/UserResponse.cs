using System;
using System.Collections.Generic;

namespace PostIt.Contracts.Users.Responses;

public sealed record UserResponse(
    Guid Id,
    string Username,
    string Email,
    string Password,
    bool IsVerified,
    string Role,
    DateTime CreatedOnUtc,
    DateTime ModifiedOnUtc);