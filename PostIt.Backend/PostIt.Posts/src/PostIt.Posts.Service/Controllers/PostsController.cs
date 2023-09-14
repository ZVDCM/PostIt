using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PostIt.Common.Constants;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Responses;
using PostIt.Posts.Service.Features.Posts.Queries.GetAllPosts;
using PostIt.Posts.Service.Features.Posts.Queries.GetAllPostsByUserId;
using PostIt.Posts.Service.Features.Posts.Queries.GetPostById;

namespace PostIt.Posts.Service.Controllers;

[Route("api/[controller]")]
public sealed class PostsController : ApiController
{
    public PostsController(IMapper mapper, ISender sender) : base(mapper, sender)
    {
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllPosts(
        string? searchTerm,
        string? sortColumn,
        string? sortOrder,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
        => await Result.Success(new GetAllPostsQuery(
            searchTerm,
            sortColumn,
            sortOrder,
            page,
            pageSize))
        .Bind(query => Sender.Send(query, cancellationToken))
        .Map(Mapper.Map<PageList<PostResponse>>)
        .Match(Ok, HandleFailure);

    [HttpGet("users/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllPostsByUserIdAsync(
        string? searchTerm,
        string? sortColumn,
        string? sortOrder,
        int page,
        int pageSize,
        Guid id,
        CancellationToken cancellationToken)
        => await Result.Success(new GetAllPostsByUserIdQuery(
            searchTerm,
            sortColumn,
            sortOrder,
            page,
            pageSize,
            new UserId(id)))
        .Bind(query => Sender.Send(query, cancellationToken))
        .Map(Mapper.Map<PageList<PostResponse>>)
        .Match(Ok, HandleFailure);

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPostByIdAsync(Guid id, CancellationToken cancellationToken)
        => await Result.Create(id, Errors.BadRequest)
        .Map(Mapper.Map<GetPostByIdQuery>)
        .Bind(query => Sender.Send(query, cancellationToken))
        .Map(Mapper.Map<PostResponse>)
        .Match(Ok, HandleFailure);
}
