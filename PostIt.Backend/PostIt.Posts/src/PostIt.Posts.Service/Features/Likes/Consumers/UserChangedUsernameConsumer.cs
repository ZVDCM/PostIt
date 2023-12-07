using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using PostIt.Common.Domain.Likes;
using PostIt.Common.Domain.Users;
using PostIt.Contracts.Posts.Events.Users;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using Serilog;

namespace PostIt.Posts.Service.Features.Likes.Consumers;

public sealed class UserChangedUsernameConsumer : IConsumer<UserChangedUsername>
{
    private readonly ILikeRepository _likeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public UserChangedUsernameConsumer(
        ILikeRepository likeRepository,
        IUnitOfWork unitOfWork,
        ILogger logger)
    {
        _likeRepository = likeRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<UserChangedUsername> context)
    {
        UserChangedUsername message = context.Message;

        try
        {
            IEnumerable<Like> likes = await _likeRepository
                .QueryAllLikes()
                .Where(l => l.UserId == new UserId(message.UserId))
                .ToListAsync();
            foreach (Like like in likes)
            {
                like.UpdateUsername(message.NewUsername);
            }

            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception e)
        {
            _logger.Error(e, LikeErrors.LikeNotUpdated);
        }
    }
}
