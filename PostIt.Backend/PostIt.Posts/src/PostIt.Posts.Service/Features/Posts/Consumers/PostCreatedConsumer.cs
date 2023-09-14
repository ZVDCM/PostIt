using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.AspNetCore.Hosting;
using PostIt.Contracts.Posts.Events;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Domain.Posts;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using Serilog;

namespace PostIt.Posts.Service.Features.Posts.Consumers;

public sealed class PostCreatedConsumer : IConsumer<PostCreated>
{
    private readonly IPostRepository _postRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    private readonly IWebHostEnvironment _webHostEnvironment;

    public PostCreatedConsumer(IPostRepository postRepository, IUnitOfWork unitOfWork, ILogger logger, IWebHostEnvironment webHostEnvironment)
    {
        _postRepository = postRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
        _webHostEnvironment = webHostEnvironment;
    }

    public async Task Consume(ConsumeContext<PostCreated> context)
    {
        PostCreated message = context.Message;
        try
        {
            Post post = Post.Create(
                message.UserId,
                message.Username,
                message.Title,
                message.Image);

            await _postRepository.CreateAsync(post, CancellationToken.None);
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
        catch (Exception e)
        {
            _logger.Error(e, PostErrors.PostNotCreated);
        }
    }
}
