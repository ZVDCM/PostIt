using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Persistence;

namespace PostIt.Users.Service.Infrastructure.Repositories;

public sealed class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CreateAsync(User user, CancellationToken cancellationToken)
        => await _context.Users.AddAsync(user, cancellationToken);

    public void Delete(User user)
        => _context.Users.Remove(user);

    public async Task<User?> GetUserAsync(Expression<Func<User, bool>> predicate, CancellationToken cancellationToken)
        => await _context.Users.Include(c => c.Role).AsSplitQuery().SingleOrDefaultAsync(predicate, cancellationToken);

    public IQueryable<User> QueryAllUsers()
        => _context.Users.Include(c => c.Role).AsSplitQuery();
}