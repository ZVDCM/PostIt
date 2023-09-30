import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { CreateResetTokenComponent } from './create-reset-token/create-reset-token.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyResetTokenComponent } from './verify-reset-token/verify-reset-token.component';

@NgModule({
    declarations: [
        ForgotPasswordComponent,
        CreateResetTokenComponent,
        ResetPasswordComponent,
        VerifyResetTokenComponent,
    ],
    imports: [
        CommonModule,
        ForgotPasswordRoutingModule,
        HttpClientModule,
        SharedModule,
    ],
    exports: [ForgotPasswordRoutingModule],
})
export class ForgotPasswordModule {}
