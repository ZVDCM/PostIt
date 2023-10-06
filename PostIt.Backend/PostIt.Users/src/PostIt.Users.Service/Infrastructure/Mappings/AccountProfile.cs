using System;
using System.Linq;
using AutoMapper;
using BCrypt.Net;
using Microsoft.AspNetCore.Http;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Requests.Comments;
using PostIt.Contracts.Posts.Requests.Posts;
using PostIt.Contracts.Users.Requests.Account;
using PostIt.Contracts.Users.Requests.Account.ForgotPassword;
using PostIt.Contracts.Users.Requests.Account.Verification;
using PostIt.Contracts.Users.Responses;
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
using PostIt.Users.Service.Features.Account.Commands.Post.CreatePost;
using PostIt.Users.Service.Features.Account.Commands.Post.DeletePost;
using PostIt.Users.Service.Features.Account.Commands.Post.UpdatePost;
using PostIt.Users.Service.Features.Account.Commands.Profile.ChangePassword;
using PostIt.Users.Service.Features.Account.Commands.Profile.EditProfile;
using PostIt.Users.Service.Features.Account.Commands.Refresh;
using PostIt.Users.Service.Features.Account.Commands.Verify.CreateVerificationToken;
using PostIt.Users.Service.Features.Account.Commands.Verify.VerifyVerificationTokenCommand;
using PostIt.Users.Service.Features.Account.Queries.GetProfile;
using PostIt.Users.Service.Features.Account.Queries.GetUserProfile;
using PostIt.Users.Service.Features.Email.Command.EmailResetToken;
using PostIt.Users.Service.Features.Email.Command.EmailVerificationToken;
using PostIt.Users.Service.Features.Users.Commands.CreateUser;

namespace PostIt.Users.Service.Infrastructure.Mappings;

public sealed class AccountProfile : Profile
{
    public AccountProfile()
    {
        AddLoginMappings();
        AddProfileMappings();
        AddVerificationMappings();
        AddForgotPasswordMappings();
        AddPostsMappings();
    }

    private void AddLoginMappings()
    {
        CreateMap<Result<LoginRequest>, LoginCommand>()
            .ConvertUsing(r => new LoginCommand(r.Value!.Email, r.Value.Password));
        CreateMap<Result<Tuple<User, Token>>, LoginResponse>()
            .ConvertUsing(r => new LoginResponse(
                r.Value!.Item2.Value,
                new ProfileResponse(
                    r.Value!.Item1.Username,
                    r.Value!.Item1.Email,
                    r.Value!.Item1.EmailVerified,
                    r.Value!.Item1.Role.Value,
                    r.Value!.Item1.Followings.Select(f =>
                        new FollowResponse(
                            f.FollowUserId.Value,
                            f.FollowUsername)),
                    r.Value!.Item1.Followers.Select(f =>
                        new FollowResponse(
                            f.FollowUserId.Value,
                            f.FollowUsername)),
                    r.Value!.Item1.CreatedOnUtc)));
        CreateMap<Result<string>, RefreshCommand>()
            .ConvertUsing(r => new RefreshCommand(r.Value!));
        CreateMap<Result<Tuple<User, Token>>, RefreshResponse>()
            .ConvertUsing(r => new RefreshResponse(
                r.Value!.Item2.Value,
                new ProfileResponse(
                    r.Value!.Item1.Username,
                    r.Value!.Item1.Email,
                    r.Value!.Item1.EmailVerified,
                    r.Value!.Item1.Role.Value,
                    r.Value!.Item1.Followings.Select(f =>
                        new FollowResponse(
                            f.FollowUserId.Value,
                            f.FollowUsername)),
                    r.Value!.Item1.Followers.Select(f =>
                        new FollowResponse(
                            f.FollowUserId.Value,
                            f.FollowUsername)),
                    r.Value!.Item1.CreatedOnUtc)));
        CreateMap<Result<RegisterRequest>, CreateUserCommand>()
           .ConvertUsing(r => new CreateUserCommand(User.Create(r.Value!.Username, r.Value.Email, BCrypt.Net.BCrypt.EnhancedHashPassword(r.Value.Password, HashType.SHA512, 13))));
    }

    private void AddProfileMappings()
    {
        CreateMap<Result<User>, ProfileResponse>()
            .ConvertUsing(r => new ProfileResponse(
                r.Value!.Username,
                r.Value!.Email,
                r.Value!.EmailVerified,
                r.Value!.Role.Value,
                r.Value!.Followings.Select(f =>
                    new FollowResponse(
                        f.FollowUserId.Value,
                        f.FollowUsername)),
                r.Value!.Followers.Select(f =>
                    new FollowResponse(
                        f.FollowUserId.Value,
                        f.FollowUsername)),
                r.Value!.CreatedOnUtc));
        CreateMap<Result<Tuple<string, EditProfileRequest>>, EditProfileCommand>()
            .ConvertUsing(r => new EditProfileCommand(r.Value!.Item1, r.Value.Item2.Username, r.Value.Item2.Email));
        CreateMap<Result<Tuple<string, ChangePasswordRequest>>, ChangePasswordCommand>()
            .ConvertUsing(r => new ChangePasswordCommand(r.Value!.Item1, r.Value.Item2.OldPassword, BCrypt.Net.BCrypt.EnhancedHashPassword(r.Value.Item2.NewPassword, HashType.SHA512, 13)));
        CreateMap<Result<string>, GetProfileQuery>()
            .ConvertUsing(r => new GetProfileQuery(r.Value!));
        CreateMap<Result<string>, GetUserProfileQuery>()
            .ConvertUsing(r => new GetUserProfileQuery(r.Value!));
        CreateMap<Result<Tuple<string, Guid>>, FollowUserCommand>()
            .ConvertUsing(r => new FollowUserCommand(r.Value!.Item1, new UserId(r.Value.Item2)));
        CreateMap<Result<Tuple<string, Guid>>, UnfollowUserCommand>()
            .ConvertUsing(r => new UnfollowUserCommand(r.Value!.Item1, new UserId(r.Value.Item2)));
    }

    private void AddVerificationMappings()
    {
        CreateMap<Result<string>, CreateVerificationTokenCommand>()
            .ConvertUsing(r => new CreateVerificationTokenCommand(r.Value!));
        CreateMap<Result<Tuple<User, Token>>, EmailVerificationTokenCommand>()
            .ConvertUsing(r => new EmailVerificationTokenCommand(r.Value!.Item1, r.Value.Item2));
        CreateMap<Result<Tuple<string, VerifyVerificationTokenRequest>>, VerifyVerificationTokenCommand>()
            .ConvertUsing(r => new VerifyVerificationTokenCommand(r.Value!.Item1, r.Value.Item2.Token));
    }

    private void AddForgotPasswordMappings()
    {
        CreateMap<Result<SendResetTokenRequest>, CreateResetTokenCommand>()
            .ConvertUsing(r => new CreateResetTokenCommand(r.Value!.Email));
        CreateMap<Result<Tuple<User, Token>>, EmailResetTokenCommand>()
            .ConvertUsing(r => new EmailResetTokenCommand(r.Value!.Item1, r.Value.Item2));
        CreateMap<Result<VerifyResetTokenRequest>, VerifyResetTokenCommand>()
            .ConvertUsing(r => new VerifyResetTokenCommand(r.Value!.Email, r.Value!.Token));
        CreateMap<Result<Tuple<string, ResetPasswordRequest>>, ResetPasswordCommand>()
           .ConvertUsing(r => new ResetPasswordCommand(r.Value!.Item1, BCrypt.Net.BCrypt.EnhancedHashPassword(r.Value.Item2.NewPassword, HashType.SHA512, 13)));
    }

    private void AddPostsMappings()
    {
        CreateMap<Result<Tuple<string, CreatePostRequest, IFormFile>>, CreatePostCommand>()
           .ConvertUsing(r => new CreatePostCommand(
               r.Value!.Item1,
               r.Value.Item2.Title,
               r.Value.Item2.Image,
               r.Value.Item3));
        CreateMap<Result<Tuple<string, Guid, UpdatePostRequest>>, UpdatePostCommand>()
            .ConvertUsing(r => new UpdatePostCommand(
                r.Value!.Item1,
                new PostId(r.Value.Item2),
                r.Value.Item3.Title,
                r.Value.Item3.Image));
        CreateMap<Result<Tuple<string, Guid>>, DeletePostCommand>()
            .ConvertUsing(r => new DeletePostCommand(
                r.Value!.Item1,
                new PostId(r.Value.Item2)));
        CreateMap<Result<Tuple<string, Guid>>, LikePostCommand>()
            .ConvertUsing(r => new LikePostCommand(
                r.Value!.Item1,
                new PostId(r.Value.Item2)));
        CreateMap<Result<Tuple<string, Guid>>, UnlikePostCommand>()
            .ConvertUsing(r => new UnlikePostCommand(
                r.Value!.Item1,
                new PostId(r.Value.Item2)));
        CreateMap<Result<Tuple<string, Guid, CreateCommentOnPostRequest>>, CreateCommentOnPostCommand>()
            .ConvertUsing(r => new CreateCommentOnPostCommand(
                r.Value!.Item1,
                new PostId(r.Value!.Item2),
                r.Value!.Item3.Comment));
        CreateMap<Result<Tuple<string, Guid, Guid, UpdateCommentOnPostRequest>>, UpdateCommentOnPostCommand>()
            .ConvertUsing(r => new UpdateCommentOnPostCommand(
                r.Value!.Item1,
                new PostId(r.Value!.Item2),
                new CommentId(r.Value!.Item3),
                r.Value!.Item4.Comment));
        CreateMap<Result<Tuple<string, Guid, Guid>>, DeleteCommentOnPostCommand>()
            .ConvertUsing(r => new DeleteCommentOnPostCommand(
                r.Value!.Item1,
                new PostId(r.Value!.Item2),
                new CommentId(r.Value!.Item3)));
    }
}