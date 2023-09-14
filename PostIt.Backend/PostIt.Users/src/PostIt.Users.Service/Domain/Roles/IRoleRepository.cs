using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;

namespace PostIt.Users.Service.Domain.Roles;

public interface IRoleRepository
{
    Task<IEnumerable<Role>> GetAllRolesAsync(CancellationToken cancellationToken);
    Task<Role?> GetRoleAsync(Expression<Func<Role, bool>> predicate, CancellationToken cancellationToken);
}