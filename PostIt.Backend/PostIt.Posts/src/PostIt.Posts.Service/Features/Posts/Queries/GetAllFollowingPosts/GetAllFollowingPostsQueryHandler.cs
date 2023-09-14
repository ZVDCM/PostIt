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
using PostIt.Contracts.Users.Responses;
using PostIt.Posts.Service.Domain.Posts;
using PostIt.Posts.Service.Infrastructure.Client;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetAllFollowingPosts;

public sealed class GetAllFollowingPostsQueryHandler : IQueryHandler<GetAllFollowingPostsQuery, Result<PageList<Post>>>
{
    private readonly IPostRepository _postRepository;
    private readonly IUsersClient _usersClient;

    public GetAllFollowingPostsQueryHandler(IPostRepository postRepository, IUsersClient usersClient)
    {
        _postRepository = postRepository;
        _usersClient = usersClient;
    }
    public async Task<Result<PageList<Post>>> Handle(GetAllFollowingPostsQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Post> postsQuery = _postRepository.QueryAllPosts();
        int postsCount = await postsQuery.CountAsync(cancellationToken);

        ProfileResponse? userProfile = await _usersClient.GetUserProfileAsync(request.UserId, cancellationToken);
        if (userProfile is not null)
        {
            postsQuery = postsQuery.Where(p => userProfile.Followers.Any(f => f.FollowId == p.UserId.Value));
        };

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

        return Result.Success(new PageList<Post>(request.Page, request.PageSize, postsCount, posts));
    }
}
