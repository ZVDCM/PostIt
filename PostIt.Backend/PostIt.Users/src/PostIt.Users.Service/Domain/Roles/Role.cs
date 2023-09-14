using System;
using System.Collections.Generic;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Domain.Roles;

public sealed class Role : Entity, IAuditable
{
    public RoleId Id { get; private set; }
    private readonly List<User> _users = new();
    public IReadOnlyList<User> Users => _users;
    public string Value { get; private set; } = string.Empty!;
    public DateTime CreatedOnUtc { get; init; }
    public DateTime ModifiedOnUtc { get; init; }

    private Role(RoleId id, string value)
    {
        Id = id;
        Value = value;
    }

    public static Role Create(string value)
        => new(new RoleId(Guid.NewGuid()), value);

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Id;
    }

    private Role() { }
}