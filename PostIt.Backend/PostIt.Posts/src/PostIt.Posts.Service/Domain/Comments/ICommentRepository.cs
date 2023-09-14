using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Identifiers;

namespace PostIt.Posts.Service.Domain.Comments;

public interface ICommentRepository
{

    Task CreateAsync(Comment comment, CancellationToken cancellationToken);
    IQueryable<Comment> QueryAllComments();
    Task<Comment?> GetCommentAsync(Expression<Func<Comment, bool>> predicate, CancellationToken cancellationToken);
    void Delete(Comment comment);
}