using FluentValidation;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetAllFollowingPosts;

public sealed class GetAllFollowingPostsQueryValidator : AbstractValidator<GetAllFollowingPostsQuery>
{
    public GetAllFollowingPostsQueryValidator()
    {
        RuleFor(x => x.UserId).NotNull();
    }
}