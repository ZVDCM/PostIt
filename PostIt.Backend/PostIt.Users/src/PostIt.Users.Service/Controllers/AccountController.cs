using System;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using PostIt.Common.Constants;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Requests.Comments;
using PostIt.Contracts.Posts.Requests.Posts;
using PostIt.Contracts.Users.Requests.Account;
using PostIt.Contracts.Users.Requests.Account.ForgotPassword;
using PostIt.Contracts.Users.Requests.Account.Verification;
using PostIt.Contracts.Users.Responses;
using PostIt.Users.Service.Attributes;
using PostIt.Users.Service.Domain.Roles;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Features.Account.Commands.Comment.CreateCommentOnPost;
using PostIt.Users.Service.Features.Account.Commands.Comment.DeleteCommentOnPost;
using PostIt.Users.Service.Features.Account.Commands.Comment.UpdateCommentOnPost;
using PostIt.Users.Service.Features.Account.Commands.Follow.FollowUser;
using PostIt.Users.Service.Features.Account.Commands.Follow.UnfollowUser;
using PostIt.Users.Service.Features.Account.Commands.ForgotPassword.CreateForgotPasswordToken;
using PostIt.Users.Service.Features.Account.Commands.ForgotPassword.ResetPassword;
using PostIt.Users.Service.Features.Account.Commands.ForgotPassword.VerifyResetToken;
using PostIt.Users.Service.Features.Account.Commands.Like.LikePost;
using PostIt.Users.Service.Features.Account.Commands.Like.UnlikePost;
using PostIt.Users.Service.Features.Account.Commands.Login;
using PostIt.Users.Service.Features.Account.Commands.Logout;
using PostIt.Users.Service.Features.Account.Commands.Post.CreatePost;
using PostIt.Users.Service.Features.Account.Commands.Post.DeletePost;
using PostIt.Users.Service.Features.Account.Commands.Post.UpdatePost;
using PostIt.Users.Service.Features.Account.Commands.Profile.UpdatePassword;
using PostIt.Users.Service.Features.Account.Commands.Profile.UpdateProfile;
using PostIt.Users.Service.Features.Account.Commands.Refresh;
using PostIt.Users.Service.Features.Account.Commands.Verify.CreateVerificationToken;
using PostIt.Users.Service.Features.Account.Commands.Verify.VerifyVerificationTokenCommand;
using PostIt.Users.Service.Features.Account.Queries.GetProfile;
using PostIt.Users.Service.Features.Account.Queries.GetUserProfile;
using PostIt.Users.Service.Features.Email.Command.EmailResetToken;
using PostIt.Users.Service.Features.Email.Command.EmailVerificationToken;
using PostIt.Users.Service.Features.Users.Commands.CreateUser;
using PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Jwt;
using Serilog;

namespace PostIt.Users.Service.Controllers;

[Route("api/[controller]")]
public sealed class AccountController : ApiController
{
    private readonly JwtOptions _jwtOptions;

    public AccountController(
        IMapper mapper,
        ISender sender,
        ILogger logger,
        IOptions<JwtOptions> jwtOptions) : base(mapper, sender, logger)
    {
        _jwtOptions = jwtOptions.Value;
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
        => await Result.Create(request, Errors.Unauthorized)
        .Map(Mapper.Map<LoginCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Tap(DeleteCookies)
        .Tap(SendCookie)
        .Map(Mapper.Map<LoginResponse>)
        .Match(Ok, HandleFailure);

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> LogoutAsync(CancellationToken cancellationToken)
        => await Result.Success(GetAccessToken(_jwtOptions.CookieName))
        .Map(result => new LogoutCommand(result.Value ?? ""))
        .Bind(command => Sender.Send(command, cancellationToken))
        .Tap(DeleteCookies)
        .Match(NoContent, HandleFailure);

    [HttpPost("refresh")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshAsync(CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Map(Mapper.Map<RefreshCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Tap(SendCookie)
        .Map(Mapper.Map<RefreshResponse>)
        .Match(Ok, HandleFailure);

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RegisterAccountAsync(RegisterRequest request, CancellationToken cancellationToken)
        => await Result.Create(request, Errors.BadRequest)
        .Map(Mapper.Map<CreateUserCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(Created, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpGet("profile")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetProfileAsync(CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Map(Mapper.Map<GetProfileQuery>)
        .Bind(query => Sender.Send(query, cancellationToken))
        .Map(Mapper.Map<ProfileResponse>)
        .Match(Ok, HandleFailure);

    [HttpGet("profile/{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetUserProfileAsync(Guid userId, CancellationToken cancellationToken)
        => await Result.Create(userId, Errors.Unauthorized)
        .Map(Mapper.Map<GetUserProfileQuery>)
        .Bind(query => Sender.Send(query, cancellationToken))
        .Map(Mapper.Map<ProfileResponse>)
        .Match(Ok, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPost("email/verification")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateVerificationTokenAsync(CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Map(Mapper.Map<CreateVerificationTokenCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Map(Mapper.Map<EmailVerificationTokenCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPut("verify/verificationtoken")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> VerifyVerificationTokenAsync(VerifyVerificationTokenRequest request, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => request is not null, Errors.BadRequest)
        .Join(request)
        .Map(Mapper.Map<VerifyVerificationTokenCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(Ok, HandleFailure);

    [HttpPost("forgot/password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateResetTokenAsync(
        CreateResetTokenRequest request,
        CancellationToken cancellationToken)
        => await Result.Create(request, Errors.BadRequest)
        .Map(Mapper.Map<CreateResetTokenCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Map(Mapper.Map<EmailResetTokenCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [HttpPost("verify/resettoken")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> VerifyResetTokenAsync(
        VerifyResetTokenRequest request,
        CancellationToken cancellationToken)
        => await Result.Create(request, Errors.BadRequest)
        .Map(Mapper.Map<VerifyResetTokenCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Tap(DeleteCookies)
        .Tap(SendCookie)
        .Map(Mapper.Map<LoginResponse>)
        .Match(Ok, HandleFailure);

    [OneShotUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPut("reset/password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => request is not null, Errors.BadRequest)
        .Join(request)
        .Map(Mapper.Map<ResetPasswordCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Tap(DeleteCookies)
        .Match(Ok, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPut("update/password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdatePasswordAsync(UpdatePasswordRequest request, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => request is not null, Errors.BadRequest)
        .Join(request)
        .Map(Mapper.Map<UpdatePasswordCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(Ok, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPut("update/profile")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateProfileAsync(UpdateProfileRequest request, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => request is not null, Errors.BadRequest)
        .Join(request)
        .Map(Mapper.Map<UpdateProfileCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Map(Mapper.Map<ProfileResponse>)
        .Match(Ok, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPost("/follow/{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> FollowUserAsync(Guid userId, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => userId != Guid.Empty, Errors.BadRequest)
        .Map(Mapper.Map<FollowUserCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(Ok, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPost("/unfollow/{userId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UnfollowUserAsync(Guid userId, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => userId != Guid.Empty, Errors.BadRequest)
        .Map(Mapper.Map<UnfollowUserCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPost("posts")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreatePostAsync(
        CreatePostRequest request,
        IFormFile file,
        CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => request is not null, Errors.BadRequest)
        .Join(request)
        .Ensure(_ => file is not null, Errors.BadRequest)
        .Join(file)
        .Map(Mapper.Map<CreatePostCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPut("posts/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdatePostAsync(Guid id, UpdatePostRequest request, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => id != Guid.Empty, Errors.BadRequest)
        .Join(id)
        .Ensure(_ => request is not null, Errors.BadRequest)
        .Join(request)
        .Map(Mapper.Map<UpdatePostCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpDelete("posts/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeletePostAsync(Guid id, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => id != Guid.Empty, Errors.BadRequest)
        .Join(id)
        .Map(Mapper.Map<DeletePostCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPost("posts/{id:guid}/like")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> LikePostAsync(Guid id, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => id != Guid.Empty, Errors.BadRequest)
        .Join(id)
        .Map(Mapper.Map<LikePostCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpDelete("posts/{id:guid}/unlike")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UnlikePostAsync(Guid id, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => id != Guid.Empty, Errors.BadRequest)
        .Join(id)
        .Map(Mapper.Map<UnlikePostCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPost("posts/{id:guid}/comment")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> CreateCommentOnPostAsync(Guid id, CreateCommentOnPostRequest request, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => id != Guid.Empty, Errors.BadRequest)
        .Join(id)
        .Ensure(_ => request is not null, Errors.BadRequest)
        .Join(request)
        .Map(Mapper.Map<CreateCommentOnPostCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpPut("posts/{id:guid}/comments/{commentId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UpdateCommentOnPostAsync(Guid id, Guid commentId, UpdateCommentOnPostRequest request, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => id != Guid.Empty, Errors.BadRequest)
        .Join(id)
        .Ensure(_ => commentId != Guid.Empty, Errors.BadRequest)
        .Join(commentId)
        .Ensure(_ => request is not null, Errors.BadRequest)
        .Join(request)
        .Map(Mapper.Map<UpdateCommentOnPostCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    [SessionUser(RoleConstants.Admin, RoleConstants.User)]
    [HttpDelete("posts/{id:guid}/comments/{commentId:guid}")]
    public async Task<IActionResult> DeleteCommentOnPostAsync(Guid id, Guid commentId, CancellationToken cancellationToken)
        => await Result.Create(GetAccessToken(_jwtOptions.CookieName), Errors.Unauthorized)
        .Ensure(_ => id != Guid.Empty, Errors.BadRequest)
        .Join(id)
        .Ensure(_ => commentId != Guid.Empty, Errors.BadRequest)
        .Join(commentId)
        .Map(Mapper.Map<DeleteCommentOnPostCommand>)
        .Bind(command => Sender.Send(command, cancellationToken))
        .Match(NoContent, HandleFailure);

    private CookieOptions GetCookieOptions()
       => new()
       {
           MaxAge = TimeSpan.FromSeconds(_jwtOptions.SecondsAccessTokenExpiration),
           HttpOnly = true,
           IsEssential = true,
           SameSite = SameSiteMode.None,
           Secure = true,
       };

    private void SendCookie(Result<Tuple<User, Token>> result)
    {
        if (result.IsFailure) return;
        var cookieOptions = GetCookieOptions();
        var token = result.Value!.Item2;
        Response.Cookies.Append(_jwtOptions.CookieName, token.Value, cookieOptions);
    }

    private void DeleteCookies(Result result)
    {
        if (result.IsFailure) return;
        var cookieOptions = GetCookieOptions();
        Response.Cookies.Delete(_jwtOptions.CookieName, cookieOptions);
    }
}