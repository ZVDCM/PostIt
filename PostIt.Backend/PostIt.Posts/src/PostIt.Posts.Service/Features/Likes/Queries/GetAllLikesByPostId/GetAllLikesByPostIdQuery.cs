using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Posts.Service.Domain.Likes;

namespace PostIt.Posts.Service.Features.Likes.Queries.GetAllLikesByPostId;

public readonly record struct GetAllLikesByPostIdQuery(
    string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize,
    PostId PostId) : IQuery<Result<PageList<Like>>>;