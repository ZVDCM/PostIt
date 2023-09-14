using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using PostIt.Users.Service.Infrastructure.Authorization.AuthorizationHandler;

namespace PostIt.Users.Service.Infrastructure.Authorization;

public sealed class AuthorizationPolicyProvider : DefaultAuthorizationPolicyProvider
{
    public AuthorizationPolicyProvider(IOptions<AuthorizationOptions> options) : base(options)
    {
    }

    public override async Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        var policy = await base.GetPolicyAsync(policyName);
        if (policy is not null) return policy;

        return new AuthorizationPolicyBuilder()
            .AddRequirements(new AuthorizationRequirement(policyName))
            .Build();
    }
}