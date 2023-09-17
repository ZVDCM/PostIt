import { Injectable } from '@angular/core';
import { IForm } from '../types/formType';

@Injectable({ providedIn: 'root' })
export class AccountConstantsService {
    public readonly loginEndpoint = '/account/login';
    public readonly registerEndpoint = '/account/register';
    public readonly forgotPasswordEndpoint = '/account/forgotpassword';

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
}
