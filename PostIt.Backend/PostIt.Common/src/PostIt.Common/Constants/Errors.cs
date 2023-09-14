using System.Net;
using PostIt.Common.Primitives;

namespace PostIt.Common.Constants;

public static class Errors
{
    public static Error BadRequest => new(
        "API.UnprocessableRequest",
        "The server could not understand the request due to invalid syntax.",
        (int)HttpStatusCode.BadRequest);
    public static Error Unauthorized => new(
        "API.Unauthorized",
        "The request requires user authentication.",
        (int)HttpStatusCode.Unauthorized);
}