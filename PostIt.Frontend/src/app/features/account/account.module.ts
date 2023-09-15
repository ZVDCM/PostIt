import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [AccountComponent, LoginComponent],
    imports: [
        CommonModule,
        SharedModule,
        AccountRoutingModule,
        ReactiveFormsModule,
    ],
    exports: [AccountComponent, AccountRoutingModule],
})
export class AccountModule {}
