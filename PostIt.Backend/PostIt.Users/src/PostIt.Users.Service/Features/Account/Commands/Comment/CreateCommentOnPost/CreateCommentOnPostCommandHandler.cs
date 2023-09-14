using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Abstractions.Commands;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Events.Comments;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Authentication;

namespace PostIt.Users.Service.Features.Account.Commands.Comment.CreateCommentOnPost;

public sealed class CreateCommentOnPostCommandHandler : ICommandHandler<CreateCommentOnPostCommand, Result>
{
    private readonly IJwtService _jwtService;
    private readonly IPublishEndpoint _publishEndpoint;

    public CreateCommentOnPostCommandHandler(IJwtService jwtService, IPublishEndpoint publishEndpoint)
    {
        _jwtService = jwtService;
        _publishEndpoint = publishEndpoint;
    }

    public async Task<Result> Handle(CreateCommentOnPostCommand request, CancellationToken cancellationToken)
    {
        Result<User> result = await _jwtService.GetUserAsync(request.AccessToken, cancellationToken);
        if (result.IsFailure) return Result.Failure(result.Error);

        User user = result.Value!;
        PostCommentCreated postCommentCreated = new(request.PostId.Value, user.Id.Value, user.Username, request.Comment);
        await _publishEndpoint.Publish(postCommentCreated, cancellationToken);

        return Result.Success();
    }
}
