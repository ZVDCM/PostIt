import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

import { LoadingComponent } from './components/loading.component';

@NgModule({
    declarations: [LoadingComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        CheckboxModule,
        ToastModule,
    ],
    exports: [
        LoadingComponent,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        ToastModule,
    ],
})
export class SharedModule {}
