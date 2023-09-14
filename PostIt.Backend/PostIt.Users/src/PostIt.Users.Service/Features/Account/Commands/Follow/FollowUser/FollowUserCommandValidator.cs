using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Follow.FollowUser;

public sealed class FollowUserCommandValidator : AbstractValidator<FollowUserCommand>
{
    public FollowUserCommandValidator()
    {
        RuleFor(x => x.FollowUserId).NotNull();
    }
}