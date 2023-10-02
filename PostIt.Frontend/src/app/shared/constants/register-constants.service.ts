import { Injectable } from '@angular/core';
import { IForm } from 'src/app/core/models/form.model';

@Injectable({
    providedIn: 'root',
})
export class RegisterConstantsService {
    public readonly registerRoute = '/register';
    public readonly registerEndpoint = '/account/register';

    public readonly registerForm: IForm = {
        username: {
            id: 'txt-register-username',
            name: 'username',
            label: 'Username',
            hint: 'Username must not be empty',
        },
        email: {
            id: 'txt-register-email',
            name: 'email',
            label: 'Email',
            hint: 'Email must follow valid email format',
        },
        password: {
            id: 'txt-register-password',
            name: 'password',
            label: 'Password',
            hint: 'Password must not be empty',
        },
        confirmPassword: {
            id: 'txt-register-confirm-password',
            name: 'confirmPassword',
            label: 'Confirm Password',
            hint: 'Both passwords must match',
        },
    };
}
