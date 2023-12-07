using System;
using System.Collections.Generic;
using System.Linq;
using PostIt.Common.Domain.Roles;
using PostIt.Common.Primitives;

namespace PostIt.Common.Domain.Users;

public sealed class User : Entity, IAggregate, IAuditable
{
    public UserId Id { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Password { get; private set; } = string.Empty;
    private readonly List<Token> _refreshTokens = new();
    public IReadOnlyList<Token> RefreshTokens => _refreshTokens;
    private readonly List<Token> _forgotPasswordTokens = new();
    public IReadOnlyList<Token> ForgotPasswordTokens => _forgotPasswordTokens;
    private readonly List<Token> _verificationTokens = new();
    public IReadOnlyList<Token> VerificationTokens => _verificationTokens;
    public bool EmailVerified { get; private set; } = false;
    public RoleId RoleId { get; private set; }
    public Role Role { get; private set; } = null!;
    public DateTime CreatedOnUtc { get; init; }
    public DateTime ModifiedOnUtc { get; init; }

    private User(
        UserId id,
        string username,
        string email,
        string password,
        DateTime? dateTime = null)
    {
        Id = id;
        Username = username;
        Email = email;
        Password = password;

        if (dateTime is not null)
        {
            CreatedOnUtc = dateTime.Value;
        }
    }

    public static User Create(string username, string email, string password, DateTime? createdOnUtc = null)
        => new(
            new UserId(Guid.NewGuid()),
            username,
            email,
            password,
            createdOnUtc);

    public void Update(string username, string email, string password)
    {
        Username = username;
        Email = email;
        Password = password;
    }

    public void EditProfile(string username, string email)
    {
        Username = username;
        Email = email;

    }

    public void ChangePassword(string password)
        => Password = password;

    public void UpdateRole(Role role)
        => RoleId = role.Id;

    public void AddRefreshToken(Token token)
        => _refreshTokens.Add(token);

    public Token? GetLatestRefreshToken()
        => _refreshTokens.OrderBy(t => t.IssuedAt).LastOrDefault();

    public void DisableLatestRefreshToken()
        => GetLatestRefreshToken()?.Disable();

    public void AddForgotPasswordToken(Token token)
        => _forgotPasswordTokens.Add(token);

    public Token? GetForgotPasswordToken(Func<Token, bool> predicate)
        => _forgotPasswordTokens.SingleOrDefault(predicate);

    public void AddVerificationToken(Token token)
        => _verificationTokens.Add(token);

    public Token? GetVerificationToken(Func<Token, bool> predicate)
        => _verificationTokens.SingleOrDefault(predicate);

    public Token? GetLatestVerificationToken()
        => _verificationTokens.OrderBy(t => t.IssuedAt).LastOrDefault();

    public void VerifyEmail()
        => EmailVerified = true;

    public void UnverifyEmail()
        => EmailVerified = false;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Id;
    }

    private User() { }
}