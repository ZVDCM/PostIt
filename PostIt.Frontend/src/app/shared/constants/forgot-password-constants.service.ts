import { Injectable } from '@angular/core';
import { IForm } from 'src/app/core/models/form.model';

@Injectable({
    providedIn: 'root',
})
export class ForgotPasswordConstantsService {
    public readonly forgotPasswordRoute = '/forgotpassword';
    public readonly createResetTokenEndpoint = '/account/create/resettoken';
    public readonly verifyResetTokenRoute =
        this.forgotPasswordRoute + '/verify/resettoken';
    public readonly verifyResetTokenEndpoint = '/account/verify/resettoken';
    public readonly resetPasswordRoute =
        this.forgotPasswordRoute + '/reset/password';
    public readonly resetPasswordEndpoint = '/account/reset/password';

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
