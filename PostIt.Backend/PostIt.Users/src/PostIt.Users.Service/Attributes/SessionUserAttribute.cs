using Microsoft.AspNetCore.Authorization;
using PostIt.Users.Service.Constants;

namespace PostIt.Users.Service.Attributes;

public sealed class SessionUserAttribute : AuthorizeAttribute
{
    public SessionUserAttribute(params string[] roles) : base(policy: PolicyConstants.SessionPolicy)
    {
        Roles = string.Join(",", roles);
    }
}