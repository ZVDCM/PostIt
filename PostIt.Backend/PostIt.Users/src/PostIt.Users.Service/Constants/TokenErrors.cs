using System.Net;
using PostIt.Common.Primitives;

namespace PostIt.Users.Service.Constants;

public static class TokenErrors
{
    public static Error TokenNotCreated => new(
       "UserAPI.TokenNotCreated",
       "The token was not created.",
       (int)HttpStatusCode.InternalServerError);
    public static Error TokenNotFound => new(
        "UserAPI.TokenNotFound",
        "Token not found.",
        (int)HttpStatusCode.NotFound);
    public static Error TokenExpired => new(
        "UserAPI.TokenExpired",
        "Token is expired.",
        (int)HttpStatusCode.Forbidden);
}