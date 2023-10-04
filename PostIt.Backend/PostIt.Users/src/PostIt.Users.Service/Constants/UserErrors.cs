using System.Net;
using PostIt.Common.Primitives;

namespace PostIt.Users.Service.Constants;

public static class UserErrors
{
    public static Error UserWrongPassword => new(
        "UserAPI.UserWrongPassword",
        "The user password is wrong.",
        (int)HttpStatusCode.Forbidden);
    public static Error UserNotVerified => new(
        "UserAPI.UserNotVerified",
        "The user is not verified.",
        (int)HttpStatusCode.Forbidden);
    public static Error UserAlreadyExists => new(
        "UserAPI.UserAlreadyExists",
        "The user already exists.",
        (int)HttpStatusCode.Conflict);
    public static Error UserNotCreated => new(
        "UserAPI.UserNotCreated",
        "The user was not created.",
        (int)HttpStatusCode.InternalServerError);
    public static Error UserNotFound => new(
        "UserAPI.UserNotFound",
        "The user was not found.",
        (int)HttpStatusCode.NotFound);
    public static Error UserNotUpdated => new(
        "UserAPI.UserNotUpdated",
        "The user was not updated.",
        (int)HttpStatusCode.InternalServerError);
    public static Error UserNotDeleted => new(
        "UserAPI.UserNotDeleted",
        "The user was not deleted.",
        (int)HttpStatusCode.InternalServerError);
    public static Error UserForbidden => new(
        "UserAPI.UserForbidden",
        "User request is forbidden.",
        (int)HttpStatusCode.Forbidden);
}