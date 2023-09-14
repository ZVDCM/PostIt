using FluentValidation;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetAllPostsByUserId;

public sealed class GetAllPostsByUserIdQueryValidator : AbstractValidator<GetAllPostsByUserIdQuery>
{
    public GetAllPostsByUserIdQueryValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
    }
}