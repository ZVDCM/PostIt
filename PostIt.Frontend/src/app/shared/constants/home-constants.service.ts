import { Injectable } from '@angular/core';
import { IForm } from 'src/app/core/models/form.model';

@Injectable({
    providedIn: 'root',
})
export class HomeConstantsService {
    public readonly homeRoute = '/home';
    public readonly logoutEndpoint = '/account/logout';
    public readonly editProfileEndpoint = '/account/edit/profile';
    public readonly changePasswordEndpoint = '/account/change/password';

    public readonly profileForm: IForm = {
        username: {
            id: 'txt-update-username',
            name: 'username',
            label: 'Username',
            hint: 'Username must not be empty',
        },
        email: {
            id: 'txt-update-email',
            name: 'email',
            label: 'Email',
            hint: 'Email must follow valid email format',
        },
    };
    public readonly passwordForm: IForm = {
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
