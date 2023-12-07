using System;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Verify.CreateVerificationToken;

public readonly record struct CreateVerificationTokenCommand(string AccessToken) : ICommand<Result<Tuple<User, Token>>>;