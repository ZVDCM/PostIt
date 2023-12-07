using System;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Domain.Posts;
using PostIt.Contracts.Posts.Events;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using Serilog;

namespace PostIt.Posts.Service.Features.Posts.Consumers;

public sealed class PostCreatedConsumer : IConsumer<PostCreated>
{
    private readonly IPostRepository _postRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public PostCreatedConsumer(IPostRepository postRepository, IUnitOfWork unitOfWork, ILogger logger)
    {
        _postRepository = postRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<PostCreated> context)
    {
        PostCreated message = context.Message;
        try
        {
            Post post = Post.Create(
                message.UserId,
                message.Username,
                message.Body);

            await _postRepository.CreateAsync(post, CancellationToken.None);
            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception e)
        {
            _logger.Error(e, PostErrors.PostNotCreated);
        }
    }
}
