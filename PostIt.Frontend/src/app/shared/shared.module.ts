import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TabMenuModule } from 'primeng/tabmenu';

import { LoadingComponent } from './components/loading.component';
import { NotfoundComponent } from './components/not-found.component';

@NgModule({
    declarations: [NotfoundComponent, LoadingComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        CheckboxModule,
        ToastModule,
        TabMenuModule,
    ],
    exports: [
        NotfoundComponent,
        LoadingComponent,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        ToastModule,
        TabMenuModule,
    ],
})
export class SharedModule {}
