using System;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Identifiers;
using PostIt.Contracts.Posts.Events.Likes;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Domain.Likes;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using Serilog;

namespace PostIt.Posts.Service.Features.Likes.Consumers;

public sealed class PostUnlikedConsumer : IConsumer<PostUnliked>
{
    private readonly ILikeRepository _likeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public PostUnlikedConsumer(ILikeRepository likeRepository, IUnitOfWork unitOfWork, ILogger logger)
    {
        _likeRepository = likeRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<PostUnliked> context)
    {
        PostUnliked message = context.Message;
        try
        {
            Like? like = await _likeRepository.GetLikeAsync(p => p.PostId == new PostId(message.PostId) && p.UserId == new UserId(message.UserId), CancellationToken.None);
            if (like is null)
            {
                _logger.Error(LikeErrors.LikeNotFound);
                return;
            };

            _likeRepository.Delete(like);
            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception e)
        {
            _logger.Error(e, LikeErrors.LikeNotDeleted);
        }
    }
}
