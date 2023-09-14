using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Posts.Service.Domain.Comments;

namespace PostIt.Posts.Service.Features.Comments.Queries.GetAllCommentsByUserId;

public readonly record struct GetAllCommentsByUserIdQuery(
    string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize,
    UserId UserId) : IQuery<Result<PageList<Comment>>>;