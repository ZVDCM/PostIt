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
    private readonly IWebHostEnvironment _webHostEnvironment;

    public PostUpdatedConsumer(
        IPostRepository postRepository,
        IUnitOfWork unitOfWork,
        ILogger logger,
        IWebHostEnvironment webHostEnvironment)
    {
        _postRepository = postRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _webHostEnvironment = webHostEnvironment;
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

            post.Update(message.Body, message.Image);
            bool isSuccessful = await _unitOfWork.SaveChangesAsync(CancellationToken.None);
            if (isSuccessful)
            {
                string filePath = Path.Combine(_webHostEnvironment.WebRootPath, message.Image);
                if (File.Exists(filePath)) return;
                await File.WriteAllBytesAsync(filePath, message.FileBytes);
            }
            else
            {
                _logger.Error(PostErrors.PostNotCreated);
            }
        }
        catch (Exception exception)
        {
            _logger.Error(exception, PostErrors.PostNotUpdated);
        }
    }
}
