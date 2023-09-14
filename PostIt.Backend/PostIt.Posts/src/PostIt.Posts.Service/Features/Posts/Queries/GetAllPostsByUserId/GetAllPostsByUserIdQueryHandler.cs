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
using PostIt.Posts.Service.Domain.Posts;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetAllPostsByUserId;

public sealed class GetAllPostsByUserIdQueryHandler : IQueryHandler<GetAllPostsByUserIdQuery, Result<PageList<Post>>>
{
    private readonly IPostRepository _postRepository;

    public GetAllPostsByUserIdQueryHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<Result<PageList<Post>>> Handle(GetAllPostsByUserIdQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Post> postsQuery = _postRepository.QueryAllPosts().Where(p => p.UserId == request.UserId);
        int postsCount = await postsQuery.CountAsync(cancellationToken);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            postsQuery = postsQuery.Where(p =>
                p.Username.Contains(request.SearchTerm) ||
                p.Title.Contains(request.SearchTerm));
        }

        Expression<Func<Post, object>> keyOrder = request.SortColumn?.ToLower() switch
        {
            "id" => p => p.Id,
            "userid" => p => p.UserId,
            "username" => p => p.Username,
            "title" => p => p.Title,
            "image" => p => p.Image,
            "modifiedonutc" => p => p.ModifiedOnUtc,
            _ => p => p.CreatedOnUtc,
        };

        postsQuery = request.SortOrder?.ToLower() switch
        {
            "desc" => postsQuery.OrderByDescending(keyOrder),
            _ => postsQuery.OrderBy(keyOrder),
        };

        IEnumerable<Post> posts = await postsQuery
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return Result.Success(new PageList<Post>(request.Page, request.PageSize, posts.Count(), posts));
    }
}
