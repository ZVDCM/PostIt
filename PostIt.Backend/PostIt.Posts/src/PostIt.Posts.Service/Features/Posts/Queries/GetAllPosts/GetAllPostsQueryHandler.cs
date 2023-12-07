using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetAllPosts;

public sealed class GetAllPostsQueryHandler : IQueryHandler<GetAllPostsQuery, Result<PageList<Post>>>
{
    private readonly IPostRepository _postRepository;

    public GetAllPostsQueryHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<Result<PageList<Post>>> Handle(GetAllPostsQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Post> postsQuery = _postRepository.QueryAllPosts();
        int postsCount = await postsQuery.CountAsync(cancellationToken);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            postsQuery = postsQuery.Where(p =>
                p.Username.Contains(request.SearchTerm) ||
                p.Body.Contains(request.SearchTerm));
        }

        Expression<Func<Post, object>> keyOrder = request.SortColumn?.ToLower() switch
        {
            "id" => p => p.Id,
            "userid" => p => p.UserId,
            "username" => p => p.Username,
            "body" => p => p.Body,
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

        return Result.Success(new PageList<Post>(request.Page, request.PageSize, postsCount, posts));
    }
}
