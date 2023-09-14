using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Events.Comments;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Commands.Comment.UpdateCommentOnPost;

public sealed class UpdateCommentOnPostCommandHandler : ICommandHandler<UpdateCommentOnPostCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IPublishEndpoint _publishEndpoint;

    public UpdateCommentOnPostCommandHandler(IJwtService jwtService, IPublishEndpoint publishEndpoint)
    {
        _jwtService = jwtService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result> Handle(UpdateCommentOnPostCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;
        PostCommentUpdated postCommentUpdated = new(request.PostId.Value, user.Id.Value, request.CommentId.Value, request.Comment);
        await _publishEndpoint.Publish(postCommentUpdated, cancellationToken);

        return Result.Success();
    }
}
