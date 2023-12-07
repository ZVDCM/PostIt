using System;
using System.Linq;
using AutoMapper;
using BCrypt.Net;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Users.Requests;
using PostIt.Contracts.Users.Responses;
using PostIt.Users.Service.Features.Users.Commands.CreateUser;
using PostIt.Users.Service.Features.Users.Commands.DeleteUser;
using PostIt.Users.Service.Features.Users.Commands.UpdateUser;
using PostIt.Users.Service.Features.Users.Queries.GetUserById;

namespace PostIt.Users.Service.Infrastructure.Mappings;

public sealed class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<Result<CreateUserRequest>, CreateUserCommand>()
            .ConvertUsing(r => new CreateUserCommand(User.Create(r.Value!.Username, r.Value!.Email, BCrypt.Net.BCrypt.EnhancedHashPassword(r.Value!.Password, HashType.SHA512, 13), null)));
        CreateMap<Result<Guid>, GetUserByIdQuery>()
            .ConvertUsing(r => new GetUserByIdQuery(new UserId(r.Value!)));
        CreateMap<Result<Tuple<Guid, UpdateUserRequest>>, UpdateUserCommand>()
            .ConvertUsing(r => new UpdateUserCommand(new UserId(r.Value!.Item1), r.Value!.Item2.Username, r.Value!.Item2.Email, BCrypt.Net.BCrypt.EnhancedHashPassword(r.Value!.Item2.Password, HashType.SHA512, 13)));
        CreateMap<Result<Guid>, DeleteUserCommand>()
            .ConvertUsing(r => new DeleteUserCommand(new UserId(r.Value!)));
        CreateMap<Result<PageList<User>>, PageList<UserResponse>>()
            .ConvertUsing(r => new PageList<UserResponse>(
                r.Value!.Page,
                r.Value!.PageSize,
                r.Value.TotalCount,
                r.Value!.Items.Select(u => new UserResponse(
                    u.Id.Value,
                    u.Username,
                    u.Email,
                    u.Password,
                    u.EmailVerified,
                    u.Role.Value,
                    u.CreatedOnUtc,
                    u.ModifiedOnUtc))));
        CreateMap<Result<User>, UserResponse>()
            .ConvertUsing(r => new UserResponse(
                r.Value!.Id.Value,
                r.Value!.Username,
                r.Value!.Email,
                r.Value!.Password,
                r.Value!.EmailVerified,
                r.Value!.Role.Value,
                r.Value!.CreatedOnUtc,
                r.Value!.ModifiedOnUtc));
    }
}