using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Posts.Service.Domain.Likes;

namespace PostIt.Posts.Service.Features.Likes.Queries.GetAllLikesByUserId;

public readonly record struct GetAllLikesByUserIdQuery(
    string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize,
    UserId UserId) : IQuery<Result<PageList<Like>>>;