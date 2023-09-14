using System.Collections.Generic;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;

namespace PostIt.Users.Service.Domain.Users;

public sealed class Follow : ValueObject
{
    public UserId UserId { get; set; }
    public UserId FollowUserId { get; set; }
    public string FollowUsername { get; set; } = string.Empty!;

    private Follow(UserId userId, UserId followUserId, string followUsername)
    {
        UserId = userId;
        FollowUserId = followUserId;
        FollowUsername = followUsername;
    }

    public static Follow Create(UserId userId, UserId followUserId, string followUsername)
        => new(userId, followUserId, followUsername);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        throw new System.NotImplementedException();
    }

    private Follow() { }
}