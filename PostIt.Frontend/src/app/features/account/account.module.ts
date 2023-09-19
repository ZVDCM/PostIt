import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyResetTokenComponent } from './forgot-password/verify-reset-token.component';
import { ResetPasswordComponent } from './forgot-password/reset-password.component';

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
        SharedModule,
        AccountRoutingModule,
        HttpClientModule,
        FormsModule,
    ],
    exports: [AccountComponent, AccountRoutingModule],
})
export class AccountModule {}
