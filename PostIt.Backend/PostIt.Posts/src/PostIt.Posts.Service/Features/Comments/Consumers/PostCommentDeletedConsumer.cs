using System;
using System.Threading;
using System.Threading.Tasks;
using MassTransit;
using PostIt.Common.Identifiers;
using PostIt.Contracts.Posts.Events.Comments;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Domain.Comments;
using PostIt.Posts.Service.Infrastructure.Persistence.UnitOfWork;
using Serilog;

namespace PostIt.Posts.Service.Features.Comments.Consumers;

public sealed class PostCommentDeletedConsumer : IConsumer<PostCommentDeleted>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public PostCommentDeletedConsumer(
        ICommentRepository commentRepository,
        IUnitOfWork unitOfWork,
        ILogger logger)
    {
        _commentRepository = commentRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }
    public async Task Consume(ConsumeContext<PostCommentDeleted> context)
    {
        PostCommentDeleted message = context.Message;
        try
        {
            Comment? comment = message.UserRole switch
            {
                RoleConstants.Admin => await _commentRepository.GetCommentAsync(p =>
                                        p.Id == new CommentId(message.CommentId) &&
                                        p.PostId == new PostId(message.PostId), CancellationToken.None),
                RoleConstants.User => await _commentRepository.GetCommentAsync(p =>
                                        p.Id == new CommentId(message.CommentId) &&
                                        p.PostId == new PostId(message.PostId) &&
                                        p.UserId == new UserId(message.UserId), CancellationToken.None),
                _ => throw new NotSupportedException(),
            };

            if (comment is null)
            {
                _logger.Error(CommentErrors.CommentNotFound);
                return;
            }

            _commentRepository.Delete(comment);
            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
            return;
        }
        catch (Exception e)
        {
            _logger.Error(e, CommentErrors.CommentNotDeleted);
        }
    }
}
