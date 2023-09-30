import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';
import { CreateResetTokenComponent } from './create-reset-token/create-reset-token.component';
import { VerifyResetTokenComponent } from './verify-reset-token/verify-reset-token.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
    {
        path: 'forgotpassword',
        redirectTo: 'forgotpassword/create/resettoken',
        pathMatch: 'full',
    },
    {
        path: 'forgotpassword',
        component: ForgotPasswordComponent,
        children: [
            { path: 'create/resettoken', component: CreateResetTokenComponent },
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
