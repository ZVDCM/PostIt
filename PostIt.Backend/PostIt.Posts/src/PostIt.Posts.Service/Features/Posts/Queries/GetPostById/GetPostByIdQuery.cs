using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Primitives.Results;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetPostById;

public readonly record struct GetPostByIdQuery(PostId PostId) : IQuery<Result<Post>>;