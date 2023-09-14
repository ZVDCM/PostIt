using System;

namespace PostIt.Contracts.Users.Responses;

public sealed record FollowResponse(Guid FollowId, string Username);