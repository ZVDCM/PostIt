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
using PostIt.Posts.Service.Domain.Likes;

namespace PostIt.Posts.Service.Features.Likes.Queries.GetAllLikesByUserId;

public sealed class GetAllLikesByUserIdQueryHandler : IQueryHandler<GetAllLikesByUserIdQuery, Result<PageList<Like>>>
{
    private readonly ILikeRepository _likeRepository;

    public GetAllLikesByUserIdQueryHandler(ILikeRepository likeRepository)
    {
        _likeRepository = likeRepository;
    }

    public async Task<Result<PageList<Like>>> Handle(GetAllLikesByUserIdQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Like> likesQuery = _likeRepository.QueryAllLikes().Where(l => l.UserId == request.UserId);
        int likesCount = await likesQuery.CountAsync(cancellationToken);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            likesQuery = likesQuery.Where(l => l.Username.Contains(request.SearchTerm));
        }

        Expression<Func<Like, object>> keyOrder = request.SortColumn?.ToLower() switch
        {
            "id" => l => l.Id,
            "postid" => l => l.PostId,
            "userid" => l => l.UserId,
            "username" => l => l.Username,
            "modifiedonutc" => l => l.ModifiedOnUtc,
            _ => l => l.CreatedOnUtc,
        };

        likesQuery = request.SortOrder?.ToLower() switch
        {
            "desc" => likesQuery.OrderByDescending(keyOrder),
            _ => likesQuery.OrderBy(keyOrder),
        };

        IEnumerable<Like> likes = await likesQuery
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return Result.Success(new PageList<Like>(request.Page, request.PageSize, likesCount, likes));
    }
}
