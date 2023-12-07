using System.Collections.Generic;
using PostIt.Contracts.Posts.Responses;

namespace PostIt.Contracts.Users.Responses;

public sealed record UserProfileResponse(UserResponse User, IEnumerable<PostResponse> Posts);