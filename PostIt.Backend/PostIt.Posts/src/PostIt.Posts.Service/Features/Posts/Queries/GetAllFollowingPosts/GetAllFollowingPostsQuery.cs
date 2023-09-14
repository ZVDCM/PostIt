using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Posts.Service.Domain.Posts;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetAllFollowingPosts;

public readonly record struct GetAllFollowingPostsQuery(
    string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize,
    UserId UserId) : IQuery<Result<PageList<Post>>>;