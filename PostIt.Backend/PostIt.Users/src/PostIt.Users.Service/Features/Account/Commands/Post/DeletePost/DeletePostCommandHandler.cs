using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Events;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Commands.Post.DeletePost;

public sealed class DeletePostCommandHandler : ICommandHandler<DeletePostCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IPublishEndpoint _publishEndpoint;
    public DeletePostCommandHandler(IJwtService jwtService, IPublishEndpoint publishEndpoint)
    {
        _jwtService = jwtService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result> Handle(DeletePostCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;

        if (!user.EmailVerified) return Result.Failure(UserErrors.UserNotVerified);

        PostDeleted postDeleted = new(request.PostId.Value, user.Id.Value, user.Role.Value);
        await _publishEndpoint.Publish(postDeleted, cancellationToken);

        return Result.Success();
    }
}
