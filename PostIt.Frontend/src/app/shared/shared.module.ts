import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

import { FormInputComponent } from './components/form-input.component';
import { FormInputGroupComponent } from './components/form-input-group.component';
import { LoadingComponent } from './components/loading.component';

@NgModule({
    declarations: [
        FormInputComponent,
        FormInputGroupComponent,
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
        FormInputComponent,
        FormInputGroupComponent,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
    ],
})
export class SharedModule {}
