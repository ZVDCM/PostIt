using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Events.Likes;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Commands.Like.UnlikePost;

public sealed class UnlikePostCommandHandler : ICommandHandler<UnlikePostCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IPublishEndpoint _publishEndpoint;

    public UnlikePostCommandHandler(IJwtService jwtService, IPublishEndpoint publishEndpoint)
    {
        _jwtService = jwtService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result> Handle(UnlikePostCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;
        PostUnliked postUnliked = new(request.PostId.Value, user.Id.Value);
        await _publishEndpoint.Publish(postUnliked, cancellationToken);

        return Result.Success();
    }
}
