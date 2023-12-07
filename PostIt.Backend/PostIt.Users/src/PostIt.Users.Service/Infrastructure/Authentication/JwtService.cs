using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PostIt.Common.Domain.Users;
using PostIt.Common.Primitives.Results;
using PostIt.Common.Utils;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Infrastructure.Authentication.Configurations.Options.Jwt;

namespace PostIt.Users.Service.Infrastructure.Authentication;

public sealed class JwtService : IJwtService
{
    private readonly JwtOptions _jwtOptions;
    private readonly DateTime _issuedAt;
    private readonly JwtSecurityTokenHandler _handler;
    private readonly IUserRepository _userRepository;

    public JwtService(IOptions<JwtOptions> jwtOptions, IUserRepository userRepository)
    {
        _jwtOptions = jwtOptions.Value;
        _issuedAt = DateTime.UtcNow;
        _handler = new JwtSecurityTokenHandler();
        _userRepository = userRepository;
    }

    public Token GenerateAccessToken(User user)
    {
        DateTime expiresAt = _issuedAt.AddSeconds(_jwtOptions.SecondsAccessTokenExpiration);
        string tokenValue = GenerateTokenValue(user, expiresAt);
        return Token.Create(user.Id, _issuedAt, expiresAt, tokenValue);
    }

    public Token GenerateRefreshToken(User user)
    {
        DateTime expiresAt = _issuedAt.AddSeconds(_jwtOptions.SecondsRefreshTokenExpiration);
        var tokenValue = GenerateTokenValue(user, expiresAt);
        return Token.Create(user.Id, _issuedAt, expiresAt, tokenValue);
    }

    public Result<UserId> GetUserId(string accessToken)
    {
        IEnumerable<Claim> claims = GetClaims(accessToken);
        string? id = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (id is null) return Result.Failure<UserId>(UserErrors.UserForbidden);
        if (!Guid.TryParse(id, out Guid userId)) return Result.Failure<UserId>(UserErrors.UserForbidden);
        return Result.Success(new UserId(userId));
    }

    public Result<DateTime> GetNbfDateTime(string accessToken)
    {
        IEnumerable<Claim> claims = GetClaims(accessToken);
        string? nbf = claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Nbf)?.Value;
        if (nbf is null) return Result.Failure<DateTime>(UserErrors.UserForbidden);
        DateTime? nbfDateTime = DateTimeHelper.ConvertNbfSecondsToDateTime(nbf);
        if (nbfDateTime is null) return Result.Failure<DateTime>(UserErrors.UserForbidden);
        return Result.Success((DateTime)nbfDateTime);
    }

    public async Task<Result<User>> GetUserAsync(string accessToken, CancellationToken cancellationToken)
    {
        Result<UserId> result = GetUserId(accessToken);
        if (result.IsFailure) return Result.Failure<User>(UserErrors.UserForbidden);

        User? user = await _userRepository.GetUserAsync(u => u.Id == result.Value, cancellationToken);
        if (user is null) return Result.Failure<User>(UserErrors.UserForbidden);

        return Result.Success(user);
    }

    private IEnumerable<Claim> GetClaims(string accessToken)
    {
        JwtSecurityToken jwtToken = _handler.ReadJwtToken(accessToken);
        return jwtToken.Claims;
    }

    private string GenerateTokenValue(User user, DateTime expiresAt)
    {
        SigningCredentials signingCredentials = new(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtOptions.Secret)),
            SecurityAlgorithms.HmacSha256
        );

        var claims = new Claim[] {
            new(ClaimTypes.NameIdentifier, user.Id.Value.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.Value.ToString()),
        };

        JwtSecurityToken token = new(
            _jwtOptions.Issuer,
            _jwtOptions.Audience,
            claims,
            notBefore: _issuedAt,
            expires: expiresAt,
            signingCredentials
        );

        string value = new JwtSecurityTokenHandler().WriteToken(token);

        return value;
    }
}