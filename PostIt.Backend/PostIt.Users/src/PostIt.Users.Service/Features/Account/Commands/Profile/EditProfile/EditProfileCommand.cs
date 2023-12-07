using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Profile.EditProfile;

public readonly record struct EditProfileCommand(string AccessToken, string Username, string Email) : ICommand<Result<User>>;