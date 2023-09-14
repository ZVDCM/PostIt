using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Users.Queries.GetAllUsers;

public sealed class GetAllUsersQueryHandler : IQueryHandler<GetAllUsersQuery, Result<PageList<User>>>
{
    private readonly IUserRepository _userRepository;

    public GetAllUsersQueryHandler(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<Result<PageList<User>>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<User> usersQuery = _userRepository.QueryAllUsers();
        int usersCount = await usersQuery.CountAsync(cancellationToken);

        if (!string.IsNullOrEmpty(request.SearchTerm))
        {
            usersQuery = usersQuery.Where(u =>
                u.Username.Contains(request.SearchTerm) ||
                u.Email.Contains(request.SearchTerm));
        }

        Expression<Func<User, object>> keyOrder = request.SortColumn?.ToLower() switch
        {
            "id" => p => p.Id,
            "username" => p => p.Username,
            "email" => p => p.Email,
            "modifiedonutc" => p => p.ModifiedOnUtc,
            _ => p => p.CreatedOnUtc,
        };

        usersQuery = request.SortOrder?.ToLower() switch
        {
            "desc" => usersQuery.OrderByDescending(keyOrder),
            _ => usersQuery.OrderBy(keyOrder),
        };

        IEnumerable<User> users = await usersQuery
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return Result.Success(new PageList<User>(request.Page, request.PageSize, usersCount, users));
    }
}
