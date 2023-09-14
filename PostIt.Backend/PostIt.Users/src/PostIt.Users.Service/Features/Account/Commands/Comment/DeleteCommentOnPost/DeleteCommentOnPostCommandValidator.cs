using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Comment.DeleteCommentOnPost;

public sealed class DeleteCommentOnPostCommandValidator : AbstractValidator<DeleteCommentOnPostCommand>
{
    public DeleteCommentOnPostCommandValidator()
    {
        RuleFor(x => x.PostId).NotNull();
        RuleFor(x => x.CommentId).NotNull();
    }
}