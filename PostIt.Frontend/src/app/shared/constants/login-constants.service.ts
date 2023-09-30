import { Injectable } from '@angular/core';
import { IForm } from '../../core/models/form.model';

@Injectable({ providedIn: 'root' })
export class LoginConstantsService {
    public readonly loginRoute = '/login';
    public readonly loginEndpoint = '/account/login';

    public readonly loginForm: IForm = {
        email: { id: 'txt-login-email', label: 'Email', hint: null },
        password: { id: 'txt-login-password', label: 'Password', hint: null },
        remember: {
            id: 'chk-remember',
            label: 'Remember my username',
            hint: null,
        },
    };
}
