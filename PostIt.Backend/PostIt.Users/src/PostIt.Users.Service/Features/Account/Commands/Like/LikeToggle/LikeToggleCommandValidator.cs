using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Like.LikeToggle;

public sealed class LikeToggleCommandValidator : AbstractValidator<LikeToggleCommand>
{
    public LikeToggleCommandValidator()
    {
        RuleFor(x => x.PostId).NotNull();
    }
}