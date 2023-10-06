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

import { LoadingComponent } from './components/loading.component';
import { FooterComponent } from './components/footer.component';
import { CommentComponent } from './components/comment.component';
import { PostComponent } from './components/post.component';
import { PostSearchComponent } from './components/post-search.component';
import { UserSearchComponent } from './components/user-search.component';
import { FollowComponent } from './components/follow.component';

@NgModule({
    declarations: [
        LoadingComponent,
        FooterComponent,
        PostComponent,
        CommentComponent,
        PostSearchComponent,
        UserSearchComponent,
        FollowComponent,
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
    ],
    exports: [
        LoadingComponent,
        FooterComponent,
        PostComponent,
        CommentComponent,
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
    ],
})
export class SharedModule {}
