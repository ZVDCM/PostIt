import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyResetTokenComponent } from './forgot-password/verify-reset-token.component';
import { ResetPasswordComponent } from './forgot-password/reset-password.component';

const routes: Routes = [
    { path: 'account', redirectTo: 'account/login', pathMatch: 'full' },
    {
        path: 'account',
        component: AccountComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent,
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
export class AccountRoutingModule {}
