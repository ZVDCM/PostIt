using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace PostIt.Common.Domain.Posts;

public interface IPostRepository
{
    Task CreateAsync(Post post, CancellationToken cancellationToken);
    IQueryable<Post> QueryAllPosts();
    Task<Post?> GetPostAsync(Expression<Func<Post, bool>> predicate, CancellationToken cancellationToken);
    void Delete(Post post);
}