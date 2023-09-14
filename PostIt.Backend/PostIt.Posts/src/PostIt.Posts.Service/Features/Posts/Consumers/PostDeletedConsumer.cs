using System;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Identifiers;
using PostIt.Contracts.Posts.Events;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Domain.Posts;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using Serilog;

namespace PostIt.Posts.Service.Features.Posts.Consumers;

public sealed class PostDeletedConsumer : IConsumer<PostDeleted>
{
    private readonly IPostRepository _postRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public PostDeletedConsumer(
        IPostRepository postRepository,
        IUnitOfWork unitOfWork,
        ILogger logger)
    {
        _postRepository = postRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<PostDeleted> context)
    {
        PostDeleted message = context.Message;
        try
        {
            Post? post = message.UserRole switch
            {
                RoleConstants.Admin => await _postRepository.GetPostAsync(p =>
                                        p.Id == new PostId(message.PostId), CancellationToken.None),
                RoleConstants.User => await _postRepository.GetPostAsync(p =>
                                        p.Id == new PostId(message.PostId) &&
                                        p.UserId == new UserId(message.UserId), CancellationToken.None),
                _ => throw new NotSupportedException(),
            };
            
            if (post is null)
            {
                _logger.Error(PostErrors.PostNotFound);
                return;
            };

            _postRepository.Delete(post);
            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception exception)
        {
            _logger.Error(exception, PostErrors.PostNotDeleted);
        }
    }
}