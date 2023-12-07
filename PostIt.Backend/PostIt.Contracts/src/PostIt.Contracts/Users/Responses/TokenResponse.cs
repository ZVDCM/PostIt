using System;

namespace PostIt.Contracts.Users.Responses;

public sealed record TokenResponse(string Value, DateTime IssuedAt, DateTime ExpiresAt, bool IsDisabled);