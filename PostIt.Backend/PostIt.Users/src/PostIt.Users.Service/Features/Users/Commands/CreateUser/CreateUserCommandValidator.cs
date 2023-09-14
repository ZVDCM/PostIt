using FluentValidation;

namespace PostIt.Users.Service.Features.Users.Commands.CreateUser;

public sealed class CreateUserCommandValidator: AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.User).NotNull();
        RuleFor(x => x.User.Email).EmailAddress();
    }
}