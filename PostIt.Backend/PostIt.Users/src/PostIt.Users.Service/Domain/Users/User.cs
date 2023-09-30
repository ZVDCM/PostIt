using System;
using System.Collections.Generic;
using System.Linq;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Users.Service.Domain.Roles;
using PostIt.Users.Service.Domain.Tokens;

namespace PostIt.Users.Service.Domain.Users;

public sealed class User : Entity, IAggregate, IAuditable
{
    public UserId Id { get; private set; }
    public string Username { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Password { get; private set; } = string.Empty;
    private readonly List<Follow> _followings = new();
    public IReadOnlyList<Follow> Followings => _followings;
    private readonly List<Follow> _followers = new();
    public IReadOnlyList<Follow> Followers => _followers;
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
        string password)
    {
        Id = id;
        Username = username;
        Email = email;
        Password = password;
    }

    public static User Create(string username, string email, string password)
        => new(
            new UserId(Guid.NewGuid()),
            username,
            email,
            password);

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

    public void DisableToken(Token token)
        => token.Disable();

    public void FollowUser(User user)
        => _followings.Add(Follow.Create(Id, user.Id, user.Username));

    public void UnfollowUser(User user)
    {
        Follow? follow = GetFollowing(user.Id);
        if (follow is null) return;
        _followings.Remove(follow);
    }

    public Follow? GetFollowing(UserId userId)
        => _followings.SingleOrDefault(f => f.UserId == userId);

    public void UserFollowed(User user)
        => _followers.Add(Follow.Create(Id, user.Id, user.Username));

    public void UserUnfollowed(User user)
    {
        Follow? follow = GetFollower(user.Id);
        if (follow is null) return;
        _followers.Remove(follow);
    }

    public Follow? GetFollower(UserId userId)
        => _followers.SingleOrDefault(f => f.UserId == userId);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Id;
    }

    private User() { }
}