using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Posts.Service.Domain.Comments;

namespace PostIt.Posts.Service.Features.Comments.Queries.GetAllCommentsByPostId;

public readonly record struct GetAllCommentsByPostIdQuery(
    string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize,
    PostId PostId
) : IQuery<Result<PageList<Comment>>>;