import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component';

@NgModule({
    declarations: [LoginComponent],
    imports: [CommonModule, HttpClientModule, SharedModule],
    exports: [LoginComponent],
})
export class LoginModule {}
