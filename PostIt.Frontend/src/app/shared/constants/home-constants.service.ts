import { Injectable } from '@angular/core';
import { IForm } from 'src/app/core/models/form.model';

@Injectable({
    providedIn: 'root',
})
export class HomeConstantsService {
    public readonly homeRoute = '/home';

    public readonly postsRoute = '/home/posts';
    public readonly postsEndpoint = '/posts';
    public readonly userPostsEndpoint = '/posts/users';
    public readonly createPostEndpoint = '/account/posts';
    public readonly deletePostEndpoint = '/account/posts';
    public readonly updatePostEndpoint = '/account/posts';
    public readonly LikePostEndpoint = (id: string) =>
        `/account/posts/${id}/like`;
    public readonly unlikePostEndpoint = (id: string) =>
        `/account/posts/${id}/unlike`;

    public readonly profileRoute = '/home/profile';

    public readonly logoutEndpoint = '/account/logout';
    public readonly updateProfileEndpoint = '/account/update/profile';
    public readonly changePasswordEndpoint = '/account/change/password';
    public readonly sendVerificationTokenEndpoint =
        '/account/send/verificationtoken';
    public readonly verifyVerificationTokenEndpoint =
        '/account/verify/verificationtoken';

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
        oldPassword: {
            id: 'txt-register-old-password',
            name: 'oldPassword',
            label: 'Old Password',
            hint: 'Old Password must not be empty',
        },
        newPassword: {
            id: 'txt-register-new-password',
            name: 'newPassword',
            label: 'New Password',
            hint: 'New Password must not be empty',
        },
        confirmPassword: {
            id: 'txt-register-confirm-password',
            name: 'confirmPassword',
            label: 'Confirm Password',
            hint: 'Password must match new password',
        },
    };

    public readonly createPostForm: IForm = {
        body: {
            id: 'txt-create-post-body',
            name: 'body',
            label: 'Body',
            hint: 'Body must not be empty',
        },
    };
    public readonly updatePostForm: IForm = {
        body: {
            id: 'txt-update-post-body',
            name: 'body',
            label: 'Body',
            hint: 'Body must not be empty',
        },
    };
}
