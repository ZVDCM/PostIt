using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetAllPosts;

public readonly record struct GetAllPostsQuery(
    string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize) : IQuery<Result<PageList<Post>>>;