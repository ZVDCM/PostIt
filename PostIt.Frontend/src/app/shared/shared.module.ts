import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

import { LoadingComponent } from './components/loading.component';

@NgModule({
    declarations: [
        LoadingComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        CheckboxModule,
    ],
    exports: [
        LoadingComponent,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
        ReactiveFormsModule,
    ],
})
export class SharedModule {}
