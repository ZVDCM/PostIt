using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Comment.CreateCommentOnPost;

public sealed class CreateCommentOnPostCommandValidator : AbstractValidator<CreateCommentOnPostCommand>
{
    public CreateCommentOnPostCommandValidator()
    {
        RuleFor(x => x.PostId).NotNull();
        RuleFor(x => x.Comment).NotEmpty();
    }
}