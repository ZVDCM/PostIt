using System;
using System.Collections.Generic;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Common.Utils;

namespace PostIt.Users.Service.Domain.Tokens;

public sealed class Token : ValueObject
{
    public UserId UserId { get; private set; }
    public string Value { get; private set; } = string.Empty;
    public DateTime IssuedAt { get; private set; } = DateTime.MinValue;
    public DateTime ExpiresAt { get; private set; } = DateTime.MinValue;
    public bool IsDisabled { get; private set; } = false;

    private Token(UserId userId, DateTime issuedAt, DateTime expiresAt, string value)
    {
        UserId = userId;
        Value = value;
        IssuedAt = issuedAt;
        ExpiresAt = expiresAt;
    }

    public static Token Create(UserId userId, DateTime issuedAt, DateTime expiresAt, string? value = null)
        => new(userId, issuedAt, expiresAt, value ?? RandomNumberHelper.Generate());

    public void Disable()
    {
        IsDisabled = true;
    }

    public bool IsExpired()
    {
        if (ExpiresAt > DateTime.UtcNow) return false;
        return true;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return UserId;
        yield return Value;
        yield return IssuedAt;
        yield return ExpiresAt;
    }

    private Token() { }
}