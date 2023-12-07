using System;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Refresh;

public readonly record struct RefreshCommand(string AccessToken) : ICommand<Result<Tuple<User, Token>>>;