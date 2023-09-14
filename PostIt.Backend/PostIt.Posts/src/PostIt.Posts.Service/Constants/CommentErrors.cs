using System.Net;
using PostIt.Common.Primitives;

namespace PostIt.Posts.Service.Constants;

public static class CommentErrors{
    public static Error CommentNotCreated => new(
        "PostAPI.CommentNotCreated",
        "The comment was not created.",
        (int)HttpStatusCode.InternalServerError);
    public static Error CommentNotFound => new(
       "PostAPI.CommentNotFound",
       "The comment was not found.",
       (int)HttpStatusCode.NotFound);
    public static Error CommentNotUpdated => new(
        "PostAPI.CommentNotUpdated",
        "The comment was not updated.",
        (int)HttpStatusCode.InternalServerError);
    public static Error CommentNotDeleted => new(
        "PostAPI.CommentNotDeleted",
        "The comment was not deleted.",
        (int)HttpStatusCode.InternalServerError);
}