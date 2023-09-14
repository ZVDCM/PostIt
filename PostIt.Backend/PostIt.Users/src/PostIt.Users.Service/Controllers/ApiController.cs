using System;
using System.Collections.Generic;
using System.Net;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Common.Primitives.Validations;

namespace PostIt.Users.Service.Controllers;

[ApiController]
public class ApiController : ControllerBase
{
    protected IMapper Mapper { get; init; }
    protected ISender Sender { get; init; }

    public ApiController(IMapper mapper, ISender sender)
    {
        Mapper = mapper;
        Sender = sender;
    }

    protected IActionResult HandleFailure(Result result)
        => result switch
        {
            { IsSuccess: true } => throw new InvalidOperationException(),
            IValidationResult validationResult => BadRequest(CreateProblemDetails(
                "Validation Error",
                StatusCodes.Status400BadRequest,
                result.Error,
                validationResult.Errors)),
            _ => MatchError(result.Error)
        };

    protected string? GetAccessToken(string cookieName)
    {
        string? accessToken = Request.Cookies[cookieName];
        return string.IsNullOrEmpty(accessToken) ? null : accessToken;
    }

    protected IActionResult Created(object? _) => StatusCode(StatusCodes.Status201Created);

    private IActionResult MatchError(Error error)
        => error.Status switch
        {
            (int)HttpStatusCode.NotFound => NotFound(),
            (int)HttpStatusCode.BadRequest => BadRequest(),
            (int)HttpStatusCode.Unauthorized => Unauthorized(),
            _ => Problem(error)
        };

    private static ProblemDetails CreateProblemDetails(
        string title,
        int status,
        Error error,
        IEnumerable<Error>? errors = null) => new()
        {
            Title = title,
            Type = error.Code,
            Detail = error.Message,
            Status = status,
            Extensions = { { nameof(errors), errors } }
        };
}