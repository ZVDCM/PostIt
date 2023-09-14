using System;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Features.Account.Commands.Refresh;

public readonly record struct RefreshCommand(string AccessToken) : ICommand<Result<Tuple<User, Token>>>;