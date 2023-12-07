using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetAllPostsByUserId;

public readonly record struct GetAllPostsByUserIdQuery(
    string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize,
    UserId UserId) : IQuery<Result<PageList<Post>>>;