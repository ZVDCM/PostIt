import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { AccountComponent } from './account.component';
import { LoginComponent } from '../../features/account/login/login.component';
import { RegisterComponent } from '../../features/account/register/register.component';
import { ForgotPasswordComponent } from '../../features/account/forgot-password/forgot-password.component';
import { AccountRoutingModule } from './account-routing.module';
import { VerifyResetTokenComponent } from './forgot-password/verify-reset-password/verify-reset-token.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';

@NgModule({
    declarations: [
        AccountComponent,
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        VerifyResetTokenComponent,
        ResetPasswordComponent,
    ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        HttpClientModule,
        SharedModule,
    ],
    exports: [AccountRoutingModule],
})
export class AccountModule {}
