using Microsoft.AspNetCore.Http;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Post.UpdatePost;

public readonly record struct UpdatePostCommand(string AccessToken, PostId PostId, string Body, string Image, IFormFile File) : ICommand<Result>;