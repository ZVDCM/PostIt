using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;
using PostIt.Posts.Service.Domain.Posts;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetPostById;

public readonly record struct GetPostByIdQuery(PostId PostId) : IQuery<Result<Post>>;