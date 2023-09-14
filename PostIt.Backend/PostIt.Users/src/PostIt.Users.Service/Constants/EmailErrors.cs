using System.Net;
using PostIt.Common.Primitives;

namespace PostIt.Users.Service.Constants;

public static class EmailErrors
{
    public static Error EmailNotSent => new(
        "UserAPI.EmailNotSent",
        "The email was not sent.",
        (int)HttpStatusCode.InternalServerError
    );
}