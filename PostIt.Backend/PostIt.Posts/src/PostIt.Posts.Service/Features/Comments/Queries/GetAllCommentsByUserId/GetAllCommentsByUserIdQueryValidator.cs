using FluentValidation;

namespace PostIt.Posts.Service.Features.Comments.Queries.GetAllCommentsByUserId;

public sealed class GetAllCommentsByUserIdQueryValidator : AbstractValidator<GetAllCommentsByUserIdQuery>
{
    public GetAllCommentsByUserIdQueryValidator()
    {
        RuleFor(x => x.UserId).NotNull();
    }
}