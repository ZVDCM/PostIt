using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Events.Comments;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Commands.Comment.DeleteCommentOnPost;

public sealed class DeleteCommentOnPostCommandHandler : ICommandHandler<DeleteCommentOnPostCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IPublishEndpoint _publishEndpoint;

    public DeleteCommentOnPostCommandHandler(IJwtService jwtService, IPublishEndpoint publishEndpoint)
    {
        _jwtService = jwtService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result> Handle(DeleteCommentOnPostCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;

        if (!user.EmailVerified) return Result.Failure(UserErrors.UserNotVerified);

        PostCommentDeleted postCommentDeleted = new(request.PostId.Value, user.Id.Value, request.CommentId.Value, user.Role.Value);
        await _publishEndpoint.Publish(postCommentDeleted, cancellationToken);

        return Result.Success();
    }
}
