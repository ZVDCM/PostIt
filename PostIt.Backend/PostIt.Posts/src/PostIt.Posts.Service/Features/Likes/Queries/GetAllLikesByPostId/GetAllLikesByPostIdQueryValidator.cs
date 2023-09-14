using FluentValidation;

namespace PostIt.Posts.Service.Features.Likes.Queries.GetAllLikesByPostId;

public sealed class GetAllLikesByPostIdQueryValidator : AbstractValidator<GetAllLikesByPostIdQuery>
{
    public GetAllLikesByPostIdQueryValidator()
    {
        RuleFor(x => x.PostId).NotNull();
    }
}