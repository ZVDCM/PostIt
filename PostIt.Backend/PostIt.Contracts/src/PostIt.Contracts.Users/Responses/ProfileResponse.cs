using System;
using System.Collections.Generic;

namespace PostIt.Contracts.Users.Responses;

public sealed record ProfileResponse(
    string Username,
    string Email,
    bool IsVerified,
    string Role,
    IEnumerable<FollowResponse> Followings,
    IEnumerable<FollowResponse> Followers,
    DateTime CreatedOnUtc);