using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Queries.GetUserProfile;

public readonly record struct GetUserProfileQuery(string Username) : IQuery<Result<User>>;