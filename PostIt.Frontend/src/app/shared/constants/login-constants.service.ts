import { Injectable } from '@angular/core';
import { IForm } from '../shared/types/formType';

@Injectable({ providedIn: 'root' })
export class LoginConstantsService {
    public readonly loginEndpoint = '/account/login';
    public readonly registerEndpoint = '/account/register';
    public readonly forgotPasswordEndpoint = '/account/forgotpassword';

    public readonly loginForm: IForm = {
        email: { id: 'txt-email', label: 'Email', hint: null },
        password: { id: 'txt-password', label: 'Password', hint: null },
        remember: {
            id: 'chk-remember',
            label: 'Remember my username',
            hint: null,
        },
    };
}
