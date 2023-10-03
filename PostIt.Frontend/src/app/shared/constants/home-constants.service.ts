import { Injectable } from '@angular/core';
import { IForm } from 'src/app/core/models/form.model';

@Injectable({
    providedIn: 'root',
})
export class HomeConstantsService {
    public readonly homeRoute = '/home';
    public readonly postsRoute = this.homeRoute + '/posts';
    public readonly profileRoute = this.homeRoute + '/profile';
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

    public readonly verificationForm: IForm = {
        token: {
            id: 'txt-verification-token',
            name: 'token',
            label: 'Token',
            hint: 'Token must not be empty',
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
