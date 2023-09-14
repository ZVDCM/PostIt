import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [AccountComponent, LoginComponent],
    imports: [CommonModule, AccountRoutingModule],
    exports: [AccountComponent, AccountRoutingModule],
})
export class AccountModule {}
