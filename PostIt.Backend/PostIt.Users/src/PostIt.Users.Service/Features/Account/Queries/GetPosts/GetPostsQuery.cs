using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Primitives.Results;

public readonly record struct GetPostsQuery(string AccessToken) : IQuery<Result<Post>>;