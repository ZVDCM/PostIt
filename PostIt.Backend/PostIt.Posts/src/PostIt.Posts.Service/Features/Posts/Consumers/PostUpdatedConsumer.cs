using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Hosting;
using PostIt.Common.Identifiers;
using PostIt.Contracts.Posts.Events;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Domain.Posts;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using Serilog;

namespace PostIt.Posts.Service.Features.Posts.Consumers;

public sealed class PostUpdatedConsumer : IConsumer<PostUpdated>
{
    private readonly IPostRepository _postRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public PostUpdatedConsumer(
        IPostRepository postRepository,
        IUnitOfWork unitOfWork,
        ILogger logger)
    {
        _postRepository = postRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<PostUpdated> context)
    {
        PostUpdated message = context.Message;
        try
        {
            Post? post = await _postRepository.GetPostAsync(p => p.Id == new PostId(message.PostId) && p.UserId == new UserId(message.UserId), CancellationToken.None);
            if (post is null)
            {
                _logger.Error("Post not found");
                return;
            };

            post.Update(message.Body);
            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception exception)
        {
            _logger.Error(exception, PostErrors.PostNotUpdated);
        }
    }
}
