using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Like.UnlikePost;

public sealed class UnlikePostCommandValidator : AbstractValidator<UnlikePostCommand>
{
    public UnlikePostCommandValidator()
    {
        RuleFor(x => x.PostId).NotNull();
    }
}