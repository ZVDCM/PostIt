using Microsoft.AspNetCore.Http;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;

namespace PostIt.Users.Service.Features.Account.Commands.Post.CreatePost;

public readonly record struct CreatePostCommand(
    string AccessToken,
    string Title,
    string Image,
    IFormFile File) : ICommand<Result>;