using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Users.Queries.GetAllUsers;

public readonly record struct GetAllUsersQuery(
    string? SearchTerm,
    string? SortColumn,
    string? SortOrder,
    int Page,
    int PageSize) : IQuery<Result<PageList<User>>>;