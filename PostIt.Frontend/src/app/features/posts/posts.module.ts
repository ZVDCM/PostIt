import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { PostsComponent } from './posts.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
    declarations: [PostsComponent],
    imports: [CommonModule, PostsRoutingModule, HttpClientModule, SharedModule],
    exports: [PostsComponent, PostsRoutingModule],
})
export class PostsModule {}
