using FluentValidation;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetPostById;

public sealed class GetPostByIdQueryValidator : AbstractValidator<GetPostByIdQuery>
{
    public GetPostByIdQueryValidator()
    {
        RuleFor(x => x.PostId).NotNull();
    }
}