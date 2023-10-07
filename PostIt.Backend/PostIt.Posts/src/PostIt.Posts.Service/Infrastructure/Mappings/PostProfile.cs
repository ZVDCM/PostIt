using System;
using System.Linq;
using AutoMapper;
using PostIt.Common.Identifiers;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Responses;
using PostIt.Posts.Service.Domain.Posts;
using PostIt.Posts.Service.Features.Posts.Queries.GetPostById;

namespace PostIt.Posts.Service.Infrastructure.Mappings;

public sealed class PostProfile : Profile
{
    public PostProfile()
    {
        CreateMap<Result<Guid>, GetPostByIdQuery>()
            .ConvertUsing(r => new GetPostByIdQuery(new PostId(r.Value)));
        CreateMap<Result<PageList<Post>>, PageList<PostResponse>>()
            .ConvertUsing(r => new PageList<PostResponse>(
                r.Value!.Page,
                r.Value!.PageSize,
                r.Value!.TotalCount,
                r.Value!.Items.Select(p => new PostResponse(
                    p.Id.Value,
                    p.UserId.Value,
                    p.Username,
                    p.Body,
                    p.Image,
                    p.CreatedOnUtc,
                    p.ModifiedOnUtc,
                    p.Likes.Count,
                    p.Comments.Count))));
        CreateMap<Result<Post>, PostResponse>()
            .ConvertUsing(r => new PostResponse(
                r.Value!.Id.Value,
                r.Value!.UserId.Value,
                r.Value!.Username,
                r.Value!.Body,
                r.Value!.Image,
                r.Value!.CreatedOnUtc,
                r.Value!.ModifiedOnUtc,
                r.Value!.Likes.Count,
                r.Value!.Comments.Count
              ));
    }
}