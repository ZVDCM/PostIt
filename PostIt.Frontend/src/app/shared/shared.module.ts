import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';

import { FormInputComponent } from './form-input/form-input.component';
import { FormInputGroupComponent } from './form-input-group/form-input-group.component';

@NgModule({
    declarations: [FormInputComponent, FormInputGroupComponent],
    imports: [
        CommonModule,
        CoreModule,
        InputTextModule,
        ButtonModule,
        ReactiveFormsModule,
    ],
    exports: [FormInputComponent, FormInputGroupComponent],
})
export class SharedModule {}
