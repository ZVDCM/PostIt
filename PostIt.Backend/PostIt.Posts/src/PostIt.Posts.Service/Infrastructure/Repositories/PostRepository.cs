using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PostIt.Posts.Service.Domain.Posts;
using PostIt.Posts.Service.Infrastructure.Persistence;

namespace PostIt.Posts.Service.Infrastructure.Repositories;

public sealed class PostRepository : IPostRepository
{
    private readonly ApplicationDbContext _context;
    public PostRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(Post post, CancellationToken cancellationToken)
        => await _context.Posts.AddAsync(post, cancellationToken);

    public void Delete(Post post)
        => _context.Posts.Remove(post);

    public async Task<Post?> GetPostAsync(Expression<Func<Post, bool>> predicate, CancellationToken cancellationToken)
        => await _context.Posts.SingleOrDefaultAsync(predicate, cancellationToken);

    public IQueryable<Post> QueryAllPosts()
        => _context.Posts.AsSplitQuery();
}
