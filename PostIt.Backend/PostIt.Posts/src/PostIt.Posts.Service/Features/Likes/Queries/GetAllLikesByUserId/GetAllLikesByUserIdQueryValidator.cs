using FluentValidation;

namespace PostIt.Posts.Service.Features.Likes.Queries.GetAllLikesByUserId;

public sealed class GetAllLikesByUserIdQueryValidator : AbstractValidator<GetAllLikesByUserIdQuery>
{
    public GetAllLikesByUserIdQueryValidator()
    {
        RuleFor(x => x.UserId).NotNull();
    }
}