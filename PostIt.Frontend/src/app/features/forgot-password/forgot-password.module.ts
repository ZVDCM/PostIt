import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { SendResetTokenComponent } from './send-reset-token/send-reset-token.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyResetTokenComponent } from './verify-reset-token/verify-reset-token.component';
import { OneShotAuthService } from '../../shared/services/users/forget-password/one-shot-auth.service';

@NgModule({
    declarations: [
        ForgotPasswordComponent,
        SendResetTokenComponent,
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
    providers: [OneShotAuthService],
})
export class ForgotPasswordModule {}
