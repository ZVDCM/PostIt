using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Events.Likes;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Commands.Like.LikePost;

public sealed class LikePostCommandHandler : ICommandHandler<LikePostCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IPublishEndpoint _publishEndpoint;

    public LikePostCommandHandler(IJwtService jwtService, IPublishEndpoint publishEndpoint)
    {
        _jwtService = jwtService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result> Handle(LikePostCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;
        PostLiked postLiked = new(request.PostId.Value, user.Id.Value, user.Username);
        await _publishEndpoint.Publish(postLiked, cancellationToken);

        return Result.Success();
    }
}
