using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Post.DeletePost;

public sealed class DeletePostCommandValidator : AbstractValidator<DeletePostCommand>
{
    public DeletePostCommandValidator()
    {
        RuleFor(x => x.PostId).NotNull();
    }
}