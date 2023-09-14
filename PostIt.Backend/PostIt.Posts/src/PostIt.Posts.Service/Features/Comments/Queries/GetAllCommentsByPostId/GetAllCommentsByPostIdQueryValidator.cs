using FluentValidation;

namespace PostIt.Posts.Service.Features.Comments.Queries.GetAllCommentsByPostId;

public sealed class GetAllCommentsByPostIdQueryValidator : AbstractValidator<GetAllCommentsByPostIdQuery>
{
    public GetAllCommentsByPostIdQueryValidator()
    {
        RuleFor(x => x.PostId).NotNull();
    }
}