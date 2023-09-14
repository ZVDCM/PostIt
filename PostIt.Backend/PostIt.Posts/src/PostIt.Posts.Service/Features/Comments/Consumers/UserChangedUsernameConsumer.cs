using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using PostIt.Common.Identifiers;
using PostIt.Contracts.Posts.Events.Users;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Domain.Comments;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using Serilog;

namespace PostIt.Posts.Service.Features.Comments.Consumers;

public sealed class UserChangedUsernameConsumer : IConsumer<UserChangedUsername>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public UserChangedUsernameConsumer(
        ICommentRepository commentRepository,
        IUnitOfWork unitOfWork,
        ILogger logger)
    {
        _commentRepository = commentRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<UserChangedUsername> context)
    {
        UserChangedUsername message = context.Message;
        try
        {
            IEnumerable<Comment> comments = await _commentRepository
                .QueryAllComments()
                .Where(c => c.UserId == new UserId(message.UserId))
                .ToListAsync();
            foreach (Comment comment in comments)
            {
                comment.UpdateUsername(message.NewUsername);
            }

            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception e)
        {
            _logger.Error(e, CommentErrors.CommentNotUpdated);
        }
    }
}
