using System.Net;
using PostIt.Common.Primitives;

namespace PostIt.Posts.Service.Constants;

public static class PostErrors
{
    public static Error PostNotCreated => new(
         "PostAPI.PostNotCreated",
         "The post was not created.",
         (int)HttpStatusCode.InternalServerError);
    public static Error PostNotFound => new(
        "PostAPI.PostNotFound",
        "The post was not found.",
        (int)HttpStatusCode.NotFound);
    public static Error PostNotUpdated => new(
        "PostAPI.PostNotUpdated",
        "The post was not updated.",
        (int)HttpStatusCode.InternalServerError);
    public static Error PostNotDeleted => new(
        "PostAPI.PostNotDeleted",
        "The post was not deleted.",
        (int)HttpStatusCode.InternalServerError);
}