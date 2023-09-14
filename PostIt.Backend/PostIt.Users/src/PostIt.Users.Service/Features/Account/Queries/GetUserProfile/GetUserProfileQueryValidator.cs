using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Queries.GetUserProfile;

public sealed class GetUserProfileQueryValidator : AbstractValidator<GetUserProfileQuery>
{
    public GetUserProfileQueryValidator()
    {
        RuleFor(x => x.UserId).NotNull();
    }
}