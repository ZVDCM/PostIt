using Microsoft.AspNetCore.Authorization;
using PostIt.Users.Service.Constants;

namespace PostIt.Users.Service.Attributes;

public sealed class OneShotUserAttribute : AuthorizeAttribute
{
    public OneShotUserAttribute(params string[] roles) : base(policy: PolicyConstants.OneShotPolicy)
    {
        Roles = string.Join(",", roles);
    }
}