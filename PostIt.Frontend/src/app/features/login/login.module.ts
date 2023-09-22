import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginRoutingModule } from './login-routing.module';

import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { VerifyResetTokenComponent } from './forgot-password/verify-reset-password/verify-reset-token.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login.component';
import { AuthComponent } from './auth/auth.component';

@NgModule({
    declarations: [
        LoginComponent,
        AuthComponent,
        RegisterComponent,
        ForgotPasswordComponent,
        VerifyResetTokenComponent,
        ResetPasswordComponent,
    ],
    imports: [CommonModule, LoginRoutingModule, HttpClientModule, SharedModule],
    exports: [LoginRoutingModule],
})
export class LoginModule {}
