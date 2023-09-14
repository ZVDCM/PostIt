using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.CreateForgotPasswordToken;

public sealed class CreateForgotPasswordTokenCommandValidator : AbstractValidator<CreateForgotPasswordTokenCommand>
{
    public CreateForgotPasswordTokenCommandValidator()
    {
        RuleFor(x => x.UserEmail).EmailAddress();
    }
}