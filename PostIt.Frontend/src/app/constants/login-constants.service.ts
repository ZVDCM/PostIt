import { Injectable } from '@angular/core';
import { ServerConstantsService } from './server-constants.service';

@Injectable()
export class LoginConstantsService {
    LoginEndpoint = '/account/login';
    RegisterEndpoint = '/account/register';
    ForgotPasswordEndpoint = '/account/forgotpassword';

    LoginForm = {
        Username: { Label: 'Username', Hint: null },
        Password: { Label: 'Password', Hint: null },
    };
}
