using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Posts.Service.Domain.Comments;

namespace PostIt.Posts.Service.Features.Comments.Queries.GetAllCommentsByUserId;

public sealed class GetAllCommentsByUserIdQueryHandler : IQueryHandler<GetAllCommentsByUserIdQuery, Result<PageList<Comment>>>
{
    private readonly ICommentRepository _commentRepository;

    public GetAllCommentsByUserIdQueryHandler(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<Result<PageList<Comment>>> Handle(GetAllCommentsByUserIdQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Comment> commentsQuery = _commentRepository.QueryAllComments().Where(l => l.UserId == request.UserId);
        int commentsCount = await commentsQuery.CountAsync(cancellationToken);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            commentsQuery = commentsQuery.Where(l =>
                l.Username.Contains(request.SearchTerm) ||
                l.Value.Contains(request.SearchTerm));
        }

        Expression<Func<Comment, object>> keyOrder = request.SortColumn?.ToLower() switch
        {
            "id" => l => l.Id,
            "postid" => l => l.PostId,
            "userid" => l => l.UserId,
            "username" => l => l.Username,
            "comment" => l => l.Value,
            "modifiedonutc" => l => l.ModifiedOnUtc,
            _ => l => l.CreatedOnUtc,
        };

        commentsQuery = request.SortOrder?.ToLower() switch
        {
            "desc" => commentsQuery.OrderByDescending(keyOrder),
            _ => commentsQuery.OrderBy(keyOrder),
        };

        IEnumerable<Comment> comments = await commentsQuery
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return Result.Success(new PageList<Comment>(request.Page, request.PageSize, commentsCount, comments));
    }
}
