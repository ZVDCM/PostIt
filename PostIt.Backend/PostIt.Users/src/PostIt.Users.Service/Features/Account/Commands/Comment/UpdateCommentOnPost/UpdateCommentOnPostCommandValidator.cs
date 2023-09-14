using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Comment.UpdateCommentOnPost;

public sealed class UpdateCommentOnPostCommandValidator : AbstractValidator<UpdateCommentOnPostCommand>
{
    public UpdateCommentOnPostCommandValidator()
    {
        RuleFor(x => x.PostId).NotNull();
        RuleFor(x => x.CommentId).NotNull();
        RuleFor(x => x.Comment).NotEmpty();
    }
}