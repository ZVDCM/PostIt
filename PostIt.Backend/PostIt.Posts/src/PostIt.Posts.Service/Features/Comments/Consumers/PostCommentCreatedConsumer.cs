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

public sealed class PostCommentCreatedConsumer : IConsumer<PostCommentCreated>
{
    private readonly ICommentRepository _commentRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger _logger;

    public PostCommentCreatedConsumer(
        ICommentRepository commentRepository,
        IUnitOfWork unitOfWork,
        ILogger logger)
    {
        _commentRepository = commentRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<PostCommentCreated> context)
    {
        PostCommentCreated message = context.Message;
        try
        {
            Comment comment = Comment.Create(new PostId(message.PostId), new UserId(message.UserId), message.Username, message.Comment);
            await _commentRepository.CreateAsync(comment, CancellationToken.None);
            await _unitOfWork.SaveChangesAsync(CancellationToken.None);
        }
        catch (Exception e)
        {
            _logger.Error(e, CommentErrors.CommentNotCreated);
        }
    }
}