import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TabMenuModule } from 'primeng/tabmenu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';

import { LoadingComponent } from './components/loading.component';
import { FooterComponent } from './components/footer.component';
import { PostItemComponent } from './components/post-item.component';

@NgModule({
    declarations: [
        LoadingComponent,
        FooterComponent,
        PostItemComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        CheckboxModule,
        ToastModule,
        TabMenuModule,
        ToggleButtonModule,
        SplitButtonModule,
        DialogModule,
        TooltipModule,
        InputTextareaModule,
        DividerModule,
        MenuModule,
        SkeletonModule,
    ],
    exports: [
        LoadingComponent,
        FooterComponent,
        PostItemComponent,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        ToastModule,
        TabMenuModule,
        ToggleButtonModule,
        SplitButtonModule,
        DialogModule,
        TooltipModule,
        InputTextareaModule,
        DividerModule,
        MenuModule,
        SkeletonModule,
    ],
})
export class SharedModule {}
