using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace PostIt.Posts.Service.Domain.Likes;

public interface ILikeRepository
{
    Task CreateAsync(Like like, CancellationToken cancellationToken);
    IQueryable<Like> QueryAllLikes();
    Task<Like?> GetLikeAsync(Expression<Func<Like, bool>> predicate, CancellationToken cancellationToken);
    void Delete(Like like);
}