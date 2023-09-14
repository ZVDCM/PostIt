using System.Threading;
using System.Threading.Tasks;

namespace PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

public interface IUnitOfWork
{
    Task<bool> SaveChangesAsync(CancellationToken cancellationToken = default);
}