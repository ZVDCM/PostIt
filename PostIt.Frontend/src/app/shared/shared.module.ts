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
import { PostItemComponent } from './components/post-item.component';
import { CommentItemComponent } from './components/comment-item.component';
import { PostSearchItemComponent } from './components/post-search-item.component';
import { UserSearchItemComponent } from './components/user-search-item.component';
import { FollowItemComponent } from './components/follow-item.component';
import { CreatePostComponent } from './components/create-post.component';

@NgModule({
    declarations: [
        LoadingComponent,
        FooterComponent,
        PostItemComponent,
        CommentItemComponent,
        PostSearchItemComponent,
        UserSearchItemComponent,
        FollowItemComponent,
        CreatePostComponent,
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
        PostItemComponent,
        CommentItemComponent,
        PostSearchItemComponent,
        UserSearchItemComponent,
        FollowItemComponent,
        CreatePostComponent,
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
