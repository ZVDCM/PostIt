import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountRoutingModule } from './account-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [AccountComponent, LoginComponent],
    imports: [
        CommonModule,
        SharedModule,
        AccountRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
    ],
    exports: [AccountComponent, AccountRoutingModule],
})
export class AccountModule {}
