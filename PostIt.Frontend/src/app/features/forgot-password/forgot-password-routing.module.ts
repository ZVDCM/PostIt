import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { SendResetTokenComponent } from './send-reset-token/send-reset-token.component';
import { VerifyResetTokenComponent } from './verify-reset-token/verify-reset-token.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
    {
        path: 'forgotpassword',
        redirectTo: 'forgotpassword/send/resettoken',
        pathMatch: 'full',
    },
    {
        path: 'forgotpassword',
        component: ForgotPasswordComponent,
        children: [
            { path: 'send/resettoken', component: SendResetTokenComponent },
            { path: 'verify/resettoken', component: VerifyResetTokenComponent },
            { path: 'reset/password', component: ResetPasswordComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ForgotPasswordRoutingModule {}
