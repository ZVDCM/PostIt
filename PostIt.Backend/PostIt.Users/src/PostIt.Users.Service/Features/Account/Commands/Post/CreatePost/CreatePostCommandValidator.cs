using FluentValidation;

namespace PostIt.Users.Service.Features.Account.Commands.Post.CreatePost;

public sealed class CreatePostCommandValidator : AbstractValidator<CreatePostCommand>
{
    public CreatePostCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Image).NotEmpty();
    }
}