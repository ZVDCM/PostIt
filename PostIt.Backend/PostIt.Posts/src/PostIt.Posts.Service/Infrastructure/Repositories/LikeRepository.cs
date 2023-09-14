using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PostIt.Common.Identifiers;
using PostIt.Posts.Service.Domain.Likes;
using PostIt.Posts.Service.Infrastructure.Persistence;

namespace PostIt.Posts.Service.Infrastructure.Repositories;

public sealed class LikeRepository : ILikeRepository
{
    private readonly ApplicationDbContext _context;

    public LikeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(Like like, CancellationToken cancellationToken)
        => await _context.Likes.AddAsync(like, cancellationToken);

    public void Delete(Like like)
        => _context.Likes.Remove(like);

    public async Task<Like?> GetLikeAsync(Expression<Func<Like, bool>> predicate, CancellationToken cancellationToken)
        => await _context.Likes.SingleOrDefaultAsync(predicate, cancellationToken);

    public IQueryable<Like> QueryAllLikes()
        => _context.Likes.AsSplitQuery();
}