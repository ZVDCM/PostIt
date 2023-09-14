using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Posts.Service.Domain.Posts;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetAllPosts;

public readonly record struct GetAllPostsQuery(
    string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize) : IQuery<Result<PageList<Post>>>;