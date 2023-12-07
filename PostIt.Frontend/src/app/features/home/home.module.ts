import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { PostsComponent } from './posts/posts.component';
import { CreatePostComponent } from './create-post.component';

@NgModule({
    declarations: [
        HomeComponent,
        ProfileComponent,
        PostsComponent,
        CreatePostComponent
    ],
    imports: [CommonModule, HttpClientModule, HomeRoutingModule, SharedModule],
    exports: [HomeRoutingModule],
})
export class HomeModule {}
