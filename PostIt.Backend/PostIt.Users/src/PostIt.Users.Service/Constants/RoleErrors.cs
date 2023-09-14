using System.Net;
using PostIt.Common.Primitives;

namespace PostIt.Users.Service.Constants;

public static class RoleErrors
{
    public static Error RoleNotFound => new(
        "UserAPI.RoleNotFound",
        "The role was not found.",
        (int)HttpStatusCode.NotFound);
}