using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PostIt.Posts.Service.Domain.Comments;
using PostIt.Posts.Service.Infrastructure.Persistence;

namespace PostIt.Posts.Service.Infrastructure.Repositories;

public sealed class CommentRepository : ICommentRepository
{
    private readonly ApplicationDbContext _context;

    public CommentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(Comment comment, CancellationToken cancellationToken)
        => await _context.Comments.AddAsync(comment, cancellationToken);

    public void Delete(Comment comment)
        => _context.Comments.Remove(comment);

    public async Task<Comment?> GetCommentAsync(Expression<Func<Comment, bool>> predicate, CancellationToken cancellationToken)
        => await _context.Comments.SingleOrDefaultAsync(predicate, cancellationToken);

    public IQueryable<Comment> QueryAllComments()
        => _context.Comments.AsSplitQuery();
}