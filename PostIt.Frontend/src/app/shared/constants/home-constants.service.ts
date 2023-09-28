import { Injectable } from '@angular/core';
import { IForm } from 'src/app/core/models/form.model';

@Injectable({
    providedIn: 'root',
})
export class HomeConstantsService {
    public readonly homeRoute = '/home';

    public readonly updateProfileEndpoint = '/account/update/profile';

    public readonly updatePasswordEndpoint = '/account/update/password';

    public readonly profileForm: IForm = {
        username: {
            id: 'txt-update-username',
            label: 'Username',
            hint: 'Username must not be empty',
        },
        email: {
            id: 'txt-update-email',
            label: 'Email',
            hint: 'Email must follow valid email format',
        },
    };
    public readonly passwordForm: IForm = {
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
