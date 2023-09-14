import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [AccountComponent, LoginComponent],
    imports: [
        CommonModule,
        SharedModule,
        AccountRoutingModule,
        ButtonModule,
        CheckboxModule,
    ],
    exports: [AccountComponent, AccountRoutingModule],
})
export class AccountModule {}
