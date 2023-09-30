import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [RegisterComponent],
    imports: [CommonModule, HttpClientModule, SharedModule],
    exports: [RegisterComponent],
})
export class RegisterModule {}
