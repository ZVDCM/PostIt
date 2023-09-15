import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginConstantsService {
    loginEndpoint = '/account/login';
    registerEndpoint = '/account/register';
    forgotPasswordEndpoint = '/account/forgotpassword';

    loginForm = {
        username: { label: 'Username', hint: null },
        password: { label: 'Password', hint: null },
    };
}
