using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.ForgotPassword.ResetPassword;

public sealed class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.NewPassword).NotEmpty();
    }
}