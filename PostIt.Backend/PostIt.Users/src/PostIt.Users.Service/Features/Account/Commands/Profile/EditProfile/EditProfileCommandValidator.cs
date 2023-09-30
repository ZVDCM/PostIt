using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Profile.EditProfile;

public sealed class EditProfileCommandValidator : AbstractValidator<EditProfileCommand>
{
    public EditProfileCommandValidator()
    {
        RuleFor(x => x.Username).NotEmpty();
        RuleFor(x => x.Email).EmailAddress();
    }
}