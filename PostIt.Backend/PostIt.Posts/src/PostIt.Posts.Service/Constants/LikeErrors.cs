using System.Net;
using PostIt.Common.Primitives;

namespace PostIt.Posts.Service.Constants;

public static class LikeErrors
{
    public static Error LikeNotCreated => new(
        "PostAPI.LikeNotCreated",
        "The comment was not created.",
        (int)HttpStatusCode.InternalServerError);
    public static Error LikeNotFound => new(
       "PostAPI.LikeNotFound",
       "The comment was not found.",
       (int)HttpStatusCode.NotFound);
    public static Error LikeNotUpdated => new(
        "PostAPI.LikeNotUpdated",
        "The comment was not updated.",
        (int)HttpStatusCode.InternalServerError);
    public static Error LikeNotDeleted => new(
        "PostAPI.LikeNotDeleted",
        "The comment was not deleted.",
        (int)HttpStatusCode.InternalServerError);
}