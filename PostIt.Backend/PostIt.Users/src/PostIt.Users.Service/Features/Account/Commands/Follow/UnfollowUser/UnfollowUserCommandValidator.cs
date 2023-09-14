using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Follow.UnfollowUser;

public sealed class UnfollowUserCommandValidator : AbstractValidator<UnfollowUserCommand>
{
    public UnfollowUserCommandValidator()
    {
        RuleFor(x => x.FollowUserId).NotNull();
    }
}