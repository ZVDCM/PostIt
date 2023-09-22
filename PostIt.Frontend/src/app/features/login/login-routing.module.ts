import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyResetTokenComponent } from './forgot-password/verify-reset-password/verify-reset-token.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { LoginComponent } from './login.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
    { path: 'login', redirectTo: 'login/auth', pathMatch: 'full' },
    {
        path: 'login',
        component: LoginComponent,
        children: [
            {
                path: 'auth',
                component: AuthComponent,
            },
            {
                path: 'register',
                component: RegisterComponent,
            },
            {
                path: 'forgotpassword',
                children: [
                    {
                        path: '',
                        component: ForgotPasswordComponent,
                    },
                    {
                        path: 'verify',
                        component: VerifyResetTokenComponent,
                    },
                ],
            },
            {
                path: 'password',
                children: [
                    {
                        path: 'reset',
                        component: ResetPasswordComponent,
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LoginRoutingModule {}
