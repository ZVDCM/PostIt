using System.Threading;
using System.Threading.Tasks;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;

namespace PostIt.Users.Service.Infrastructure.Email;

public interface IEmailSender
{
    Task<bool> EmailVerificationTokenAsync(User User, Token verificationToken, CancellationToken cancellationToken);
    Task<bool> EmailForgotPasswordTokenAsync(User User, Token forgotPasswordToken, CancellationToken cancellationToken);
}