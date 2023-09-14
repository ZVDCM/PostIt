using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Like.LikePost;

public sealed class LikePostCommandValidator : AbstractValidator<LikePostCommand>
{
    public LikePostCommandValidator()
    {
        RuleFor(x => x.PostId).NotNull();
    }
}