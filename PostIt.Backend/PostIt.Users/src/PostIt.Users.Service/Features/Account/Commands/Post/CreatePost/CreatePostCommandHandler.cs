using System.IO;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Events;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Commands.Post.CreatePost;

public sealed class CreatePostCommandHandler : ICommandHandler<CreatePostCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IPublishEndpoint _publishEndpoint;

    public CreatePostCommandHandler(IJwtService jwtService, IPublishEndpoint publishEndpoint)
    {
        _jwtService = jwtService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;

        if (!user.EmailVerified) return Result.Failure(UserErrors.UserNotVerified);

        using var memoryStream = new MemoryStream();
        await request.File.CopyToAsync(memoryStream, cancellationToken);
        byte[] fileBytes = memoryStream.ToArray();

        PostCreated postCreated = new(user.Id.Value, user.Username, request.Body, request.Image, fileBytes);
        await _publishEndpoint.Publish(postCreated, cancellationToken);

        return Result.Success();
    }
}
