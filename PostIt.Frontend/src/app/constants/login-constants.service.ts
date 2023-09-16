import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginConstantsService {
    public readonly loginEndpoint = '/account/login';
    public readonly registerEndpoint = '/account/register';
    public readonly forgotPasswordEndpoint = '/account/forgotpassword';

    public readonly loginForm = {
        username: { label: 'Email', hint: null },
        password: { label: 'Password', hint: null },
    };
}
