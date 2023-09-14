using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Account.Commands.Profile.UpdateProfile;

public readonly record struct UpdateProfileCommand(string AccessToken, string Username, string Email) : ICommand<Result<User>>;