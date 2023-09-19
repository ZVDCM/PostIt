using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.CreateForgotPasswordToken;

public sealed class CreateResetTokenCommandValidator : AbstractValidator<CreateResetTokenCommand>
{
    public CreateResetTokenCommandValidator()
    {
        RuleFor(x => x.UserEmail).EmailAddress();
    }
}