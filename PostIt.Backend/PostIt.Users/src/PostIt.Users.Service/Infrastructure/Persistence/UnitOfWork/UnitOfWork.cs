using System.Threading;
using System.Threading.Tasks;

namespace PostIt.Users.Service.Infrastructure.Persistence.UnitOfWork;

public sealed class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> SaveChangesAsync(CancellationToken cancellationToken = default)
       => await _context.SaveChangesAsync(cancellationToken) > 0;
}