using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PostIt.Common.Constants;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Users.Requests;
using PostIt.Contracts.Users.Responses;
using PostIt.Users.Service.Attributes;
using PostIt.Users.Service.Domain.Roles;
using PostIt.Users.Service.Features.Users.Commands.CreateUser;
using PostIt.Users.Service.Features.Users.Commands.DeleteUser;
using PostIt.Users.Service.Features.Users.Commands.UpdateUser;
using PostIt.Users.Service.Features.Users.Queries.GetAllUsers;
using PostIt.Users.Service.Features.Users.Queries.GetUserById;
using Serilog;

namespace PostIt.Users.Service.Controllers;

[Route("api/[controller]")]
[SessionUser(RoleConstants.Admin)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
public sealed class UsersController : ApiController
{
    public UsersController(
        IMapper mapper,
        ISender sender,
        ILogger logger) : base(mapper, sender, logger) { }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreateUserAsync(CreateUserRequest request, CancellationToken cancellationToken)
        => await Result.Create(request, Errors.BadRequest)
        .Map(Mapper.Map<CreateUserCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Map(Mapper.Map<UserResponse>)
        .Match(response =>
            CreatedAtAction(nameof(GetUserByIdAsync), new { id = response.Id }, response),
            HandleFailure);

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllUsers(
        string? searchTerm,
        string? sortColumn,
        string? sortOrder,
        int page,
        int pageSize,
        CancellationToken cancellationToken)
        => await Result.Success(new GetAllUsersQuery(
            searchTerm,
            sortColumn,
            sortOrder,
            page,
            pageSize))
        .Bind(query => Sender.Send(query, cancellationToken))
        .Map(Mapper.Map<PageList<UserResponse>>)
        .Match(Ok, HandleFailure);

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserByIdAsync(Guid id, CancellationToken cancellationToken)
        => await Result.Create(id, Errors.BadRequest)
        .Map(Mapper.Map<GetUserByIdQuery>)
        .Bind(query => Sender.Send(query, cancellationToken))
        .Map(Mapper.Map<UserResponse>)
        .Match(Ok, HandleFailure);

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken cancellationToken)
        => await Result.Create(id, Errors.BadRequest)
        .Ensure(_ => request is not null, Errors.BadRequest)
        .Join(request)
        .Map(Mapper.Map<UpdateUserCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Map(Mapper.Map<UserResponse>)
        .Match(Ok, HandleFailure);

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteUserAsync(Guid id, CancellationToken cancellationToken)
        => await Result.Create(id, Errors.BadRequest)
        .Map(Mapper.Map<DeleteUserCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Map(Mapper.Map<UserResponse>)
        .Match(Ok, HandleFailure);
}