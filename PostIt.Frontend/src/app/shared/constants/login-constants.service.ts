import { Injectable } from '@angular/core';
import { IForm } from '../../core/models/form.model';

@Injectable({ providedIn: 'root' })
export class LoginConstantsService {
    public readonly loginRoute = '/login';
    public readonly loginEndpoint = '/account/login';

    public readonly registerRoute = '/login/register';
    public readonly registerEndpoint = '/account/register';

    public readonly forgotPasswordRoute = '/login/forgot/password';
    public readonly forgotPasswordEndpoint = '/account/forgot/password';

    public readonly verifyResetTokenRoute = '/login/verify/resettoken';
    public readonly verifyResetTokenEndpoint = '/account/verify/resettoken';

    public readonly resetPasswordRoute = '/login/reset/password';
    public readonly resetPasswordEndpoint = '/account/reset/password';

    public readonly loginForm: IForm = {
        email: { id: 'txt-login-email', label: 'Email', hint: null },
        password: { id: 'txt-login-password', label: 'Password', hint: null },
        remember: {
            id: 'chk-remember',
            label: 'Remember my username',
            hint: null,
        },
    };

    public readonly registerForm: IForm = {
        username: {
            id: 'txt-register-username',
            label: 'Username',
            hint: 'Username must not be empty',
        },
        email: {
            id: 'txt-register-email',
            label: 'Email',
            hint: 'Email must follow valid email format',
        },
        password: {
            id: 'txt-register-password',
            label: 'Password',
            hint: 'Password must not be empty',
        },
        confirmPassword: {
            id: 'txt-register-confirm-password',
            label: 'Confirm Password',
            hint: 'Both passwords must match',
        },
    };

    public readonly forgotPasswordForm: IForm = {
        email: {
            id: 'txt-forgot-password-email',
            label: 'Email',
            hint: 'Email must follow valid email format',
        },
    };

    public readonly resetTokenForm: IForm = {
        token: {
            id: 'txt-reset-token',
            label: 'Token',
            hint: 'Token must not be empty',
        },
    };

    public readonly resetPasswordForm: IForm = {
        resetNewPassword: {
            id: 'txt-reset-new-password',
            label: 'New Password',
            hint: 'Password must not be empty',
        },
        resetConfirmPassword: {
            id: 'txt-reset-confirm-password',
            label: 'Confirm Password',
            hint: 'Both passwords must match',
        },
    };
}
