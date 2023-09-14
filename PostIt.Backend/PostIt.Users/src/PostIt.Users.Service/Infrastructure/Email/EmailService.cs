using System;
using System.Threading;
using System.Threading.Tasks;
using FluentEmail.Core;
using PostIt.Users.Service.Constants;
using PostIt.Users.Service.Domain.Tokens;
using PostIt.Users.Service.Domain.Users;
using PostIt.Users.Service.Infrastructure.Email.Models;
using Serilog;

namespace PostIt.Users.Service.Infrastructure.Email;

public sealed class EmailSender : IEmailSender
{
    private readonly IFluentEmail _fluentEmail;
    private readonly ILogger _logger;

    public EmailSender(IFluentEmail fluentEmail, ILogger logger)
    {
        _fluentEmail = fluentEmail;
        _logger = logger;
    }

    public async Task<bool> EmailVerificationTokenAsync(
        User user,
        Token verificationToken,
        CancellationToken cancellationToken)
    {
        TokenEmailModel emailModel = new(user.Username, "Email Verification Token", verificationToken.Value);

        var response = await _fluentEmail
            .To(user.Email)
            .Subject($"Email Verification Token: {verificationToken.Value}")
            .Tag("email-verification")
            .UsingTemplateFromFile($"{EmailConstants.TemplateFilePath}/Default.cshtml", emailModel)
            .SendAsync(cancellationToken);

        if (response.Successful) return true;
        _logger.Error(string.Join(Environment.NewLine, response.ErrorMessages));
        return false;
    }

    public async Task<bool> EmailForgotPasswordTokenAsync(
        User user,
        Token forgotPasswordToken,
        CancellationToken cancellationToken)
    {
        TokenEmailModel emailModel = new(user.Username, "Forgot Password Token", forgotPasswordToken.Value);

        var response = await _fluentEmail
            .To(user.Email)
            .Subject($"Forgot Password Token: {forgotPasswordToken.Value}")
            .Tag("forgot-password")
            .UsingTemplateFromFile($"{EmailConstants.TemplateFilePath}/Default.cshtml", emailModel)
            .SendAsync(cancellationToken);

        if (response.Successful) return true;
        _logger.Error(string.Join(Environment.NewLine, response.ErrorMessages));
        return false;
    }
}