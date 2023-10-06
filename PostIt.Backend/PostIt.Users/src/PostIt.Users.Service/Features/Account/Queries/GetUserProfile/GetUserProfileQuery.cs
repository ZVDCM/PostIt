using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Account.Queries.GetUserProfile;

public readonly record struct GetUserProfileQuery(string Username) : IQuery<Result<User>>;