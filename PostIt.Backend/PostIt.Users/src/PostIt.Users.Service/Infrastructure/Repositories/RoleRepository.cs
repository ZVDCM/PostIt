using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PostIt.Users.Service.Domain.Roles;
using PostIt.Users.Service.Infrastructure.Persistence;

namespace PostIt.Users.Service.Infrastructure.Repositories;

public sealed class RoleRepository : IRoleRepository
{
    private readonly ApplicationDbContext _context;

    public RoleRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Role>> GetAllRolesAsync(CancellationToken cancellationToken)
        => await _context.Roles.ToListAsync(cancellationToken);

    public async Task<Role?> GetRoleAsync(Expression<Func<Role, bool>> predicate, CancellationToken cancellationToken)
        => await _context.Roles.SingleOrDefaultAsync(predicate, cancellationToken);
}
