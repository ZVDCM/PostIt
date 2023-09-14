using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Users.Queries.GetUserById;

public readonly record struct GetUserByIdQuery(UserId UserId) : IQuery<Result<User>>;