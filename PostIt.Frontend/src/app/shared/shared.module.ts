import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule } from '@angular/forms';

import { FormInputComponent } from './components/form-input/form-input.component';
import { FormInputGroupComponent } from './components/form-input-group/form-input-group.component';

@NgModule({
    declarations: [FormInputComponent, FormInputGroupComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        CheckboxModule,
    ],
    exports: [
        FormInputComponent,
        FormInputGroupComponent,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
    ],
})
export class SharedModule {}
