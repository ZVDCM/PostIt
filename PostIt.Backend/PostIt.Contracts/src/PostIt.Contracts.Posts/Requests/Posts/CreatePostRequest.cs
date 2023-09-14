namespace PostIt.Contracts.Posts.Requests.Posts;

public sealed record CreatePostRequest(string Title, string Image);