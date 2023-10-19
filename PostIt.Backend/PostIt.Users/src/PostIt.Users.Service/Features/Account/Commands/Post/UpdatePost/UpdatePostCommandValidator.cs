using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Post.UpdatePost;

public sealed class UpdatePostCommandValidator : AbstractValidator<UpdatePostCommand>
{
    public UpdatePostCommandValidator()
    {
        RuleFor(x => x.PostId).NotNull();
        RuleFor(x => x.Body).NotEmpty();
    }
}