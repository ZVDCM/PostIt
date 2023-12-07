import { Injectable } from '@angular/core';
import { IForm } from 'src/app/core/models/form.model';

@Injectable({
    providedIn: 'root',
})
export class ForgotPasswordConstantsService {
    public readonly forgotPasswordRoute = '/forgotpassword';
    public readonly sendResetTokenEndpoint = '/account/send/resettoken';
    public readonly verifyResetTokenRoute = '/forgotpassword/verify/resettoken';
    public readonly verifyResetTokenEndpoint = '/account/verify/resettoken';
    public readonly resetPasswordRoute = '/forgotpassword/reset/password';
    public readonly resetPasswordEndpoint = '/account/reset/password';

    public readonly forgotPasswordForm: IForm = {
        email: {
            id: 'txt-forgot-password-email',
            name: 'email',
            label: 'Email',
            hint: 'Email must follow valid email format',
        },
    };

    public readonly resetTokenForm: IForm = {
        token: {
            id: 'txt-reset-token',
            name: 'token',
            label: 'Token',
            hint: 'Token must not be empty',
        },
    };

    public readonly resetPasswordForm: IForm = {
        resetNewPassword: {
            id: 'txt-reset-new-password',
            name: 'newPassword',
            label: 'New Password',
            hint: 'Password must not be empty',
        },
        resetConfirmPassword: {
            id: 'txt-reset-confirm-password',
            name: 'confirmPassword',
            label: 'Confirm Password',
            hint: 'Both passwords must match',
        },
    };
}
