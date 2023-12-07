using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using PostIt.Common.Domain.Posts;
using PostIt.Common.Domain.Users;
using PostIt.Contracts.Posts.Events.Users;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using Serilog;

namespace PostIt.Posts.Service.Features.Posts.Consumers;

public sealed class UserChangedUsernameConsumer : IConsumer<UserChangedUsername>
{
    private readonly IPostRepository _postRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public UserChangedUsernameConsumer(
        IPostRepository postRepository,
        IUnitOfWork unitOfWork,
        ILogger logger)
    {
        _postRepository = postRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<UserChangedUsername> context)
    {
        UserChangedUsername message = context.Message;
        try
        {
            IEnumerable<Post> posts = await _postRepository
                .QueryAllPosts()
                .Where(p => p.UserId == new UserId(message.UserId))
                .ToListAsync();
            foreach (Post post in posts)
            {
                post.UpdateUsername(message.NewUsername);
            }

            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception e)
        {
            _logger.Error(e, PostErrors.PostNotUpdated);
        }
    }
}
