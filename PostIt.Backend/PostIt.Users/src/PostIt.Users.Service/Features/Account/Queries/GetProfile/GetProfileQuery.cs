using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Account.Queries.GetProfile;

public readonly record struct GetProfileQuery(string AccessToken) : IQuery<Result<User>>;