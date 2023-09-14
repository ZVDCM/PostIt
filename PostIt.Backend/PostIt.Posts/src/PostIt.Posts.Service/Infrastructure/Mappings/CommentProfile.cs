using System.Linq;
using AutoMapper;
using PostIt.Common.Primitives;
using PostIt.Common.Primitives.Results;
using PostIt.Contracts.Posts.Responses;
using PostIt.Posts.Service.Domain.Comments;

namespace PostIt.Posts.Service.Infrastructure.Mappings;

public sealed class CommentProfile : Profile
{
    public CommentProfile()
    {
        CreateMap<Result<PageList<Comment>>, PageList<CommentResponse>>()
            .ConvertUsing(r => new PageList<CommentResponse>(
                r.Value!.Page,
                r.Value!.PageSize,
                r.Value!.TotalCount,
                r.Value!.Items.Select(c => new CommentResponse(
                    c.Id.Value,
                    c.PostId.Value,
                    c.UserId.Value,
                    c.Username,
                    c.Value,
                    c.CreatedOnUtc,
                    c.ModifiedOnUtc))));
    }
}