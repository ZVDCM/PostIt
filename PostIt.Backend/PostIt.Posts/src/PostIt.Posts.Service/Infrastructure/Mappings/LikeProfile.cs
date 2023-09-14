using System.Linq;
using AutoMapper;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Responses;
using PostIt.Posts.Service.Domain.Likes;

namespace PostIt.Posts.Service.Infrastructure.Mappings;

public sealed class LikeProfile : Profile
{
    public LikeProfile()
    {
        CreateMap<Result<PageList<Like>>, PageList<LikeResponse>>()
            .ConvertUsing(r => new PageList<LikeResponse>(
                r.Value!.Page,
                r.Value!.PageSize,
                r.Value!.TotalCount,
                r.Value!.Items.Select(l => new LikeResponse(
                    l.Id.Value,
                    l.PostId.Value,
                    l.UserId.Value,
                    l.Username,
                    l.CreatedOnUtc,
                    l.ModifiedOnUtc))));
    }
}