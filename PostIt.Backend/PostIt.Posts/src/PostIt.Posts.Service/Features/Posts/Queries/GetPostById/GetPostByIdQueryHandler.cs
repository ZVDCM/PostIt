using System.Threading;
using System.Threading.Tasks;
using PostIt.Common.Abstractions.Queries;
using PostIt.Common.Primitives.Results;
using PostIt.Posts.Service.Constants;
using PostIt.Posts.Service.Domain.Posts;

namespace PostIt.Posts.Service.Features.Posts.Queries.GetPostById;

public sealed class GetPostByIdQueryHandler : IQueryHandler<GetPostByIdQuery, Result<Post>>
{
    private readonly IPostRepository _postRepository;

    public GetPostByIdQueryHandler(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<Result<Post>> Handle(GetPostByIdQuery request, CancellationToken cancellationToken)
    {
        Post? post = await _postRepository.GetPostAsync(p => p.Id == request.PostId, cancellationToken);
        if (post is null) return Result.Failure<Post>(PostErrors.PostNotFound);
        return Result.Success(post);
    }
}
