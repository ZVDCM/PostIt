using System.Threading;
using System.Threading.Tasks;

namespace PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;

public interface IUnitOfWork
{
    Task<bool> SaveChangesAsync(CancellationToken cancellationToken = default);
}