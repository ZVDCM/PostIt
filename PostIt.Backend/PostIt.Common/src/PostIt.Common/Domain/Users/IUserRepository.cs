using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace PostIt.Common.Domain.Users;

public interface IUserRepository
{
    Task CreateAsync(User user, CancellationToken cancellationToken);
    IQueryable<User> QueryAllUsers();
    Task<User?> GetUserAsync(Expression<Func<User, bool>> predicate, CancellationToken cancellationToken);
    void Delete(User user);
}