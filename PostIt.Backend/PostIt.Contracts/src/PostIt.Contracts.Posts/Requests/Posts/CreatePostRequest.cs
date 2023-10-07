namespace PostIt.Contracts.Posts.Requests.Posts;

public sealed record CreatePostRequest(string Body, string Image);