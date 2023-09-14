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

public sealed class PostLikedConsumer : IConsumer<PostLiked>
{
    private readonly ILikeRepository _likeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public PostLikedConsumer(
        ILikeRepository likeRepository,
        IUnitOfWork unitOfWork,
        ILogger logger)
    {
        _likeRepository = likeRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<PostLiked> context)
    {
        PostLiked message = context.Message;
        try
        {
            Like? like = await _likeRepository.GetLikeAsync(p => p.PostId == new PostId(message.PostId) && p.UserId == new UserId(message.UserId), CancellationToken.None);
            if (like is not null) return;
            like = Like.Create(new PostId(message.PostId), new UserId(message.UserId), message.Username);
            await _likeRepository.CreateAsync(like, CancellationToken.None);
            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception e)
        {
            _logger.Error(e, LikeErrors.LikeNotCreated);
        }
    }
}
