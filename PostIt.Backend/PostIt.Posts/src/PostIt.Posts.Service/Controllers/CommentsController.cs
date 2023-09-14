using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Responses;
using PostIt.Posts.Service.Features.Comments.Queries.GetAllCommentsByPostId;
using PostIt.Posts.Service.Features.Comments.Queries.GetAllCommentsByUserId;

namespace PostIt.Posts.Service.Controllers;

[Route("api/[controller]")]
public sealed class CommentsController : ApiController
{
    public CommentsController(IMapper mapper, ISender sender) : base(mapper, sender)
    {
    }

    [HttpGet("posts/{postId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllCommentsByPostIdAsync(
        string? searchTerm,
        string? sortColumn,
        string? sortOrder,
        int page,
        int pageSize,
        Guid postId,
        CancellationToken cancellationToken)
        => await Result.Success(new GetAllCommentsByPostIdQuery(
            searchTerm,
            sortColumn,
            sortOrder,
            page,
            pageSize,
            new PostId(postId)))
        .Bind(query => Sender.Send(query, cancellationToken))
        .Map(Mapper.Map<PageList<CommentResponse>>)
        .Match(Ok, HandleFailure);

    [HttpGet("users/{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllCommentsByUserIdAsync(
        string? searchTerm,
        string? sortColumn,
        string? sortOrder,
        int page,
        int pageSize,
        Guid userId,
        CancellationToken cancellationToken)
        => await Result.Success(new GetAllCommentsByUserIdQuery(
            searchTerm,
            sortColumn,
            sortOrder,
            page,
            pageSize,
            new UserId(userId)))
        .Bind(query => Sender.Send(query, cancellationToken))
        .Map(Mapper.Map<PageList<CommentResponse>>)
        .Match(Ok, HandleFailure);
}