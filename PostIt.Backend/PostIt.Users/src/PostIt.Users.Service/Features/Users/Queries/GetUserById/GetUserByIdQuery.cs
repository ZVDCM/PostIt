using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Users.Queries.GetUserById;

public readonly record struct GetUserByIdQuery(UserId UserId) : IQuery<Result<User>>;