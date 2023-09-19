import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { PostsComponent } from './posts/posts.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
    declarations: [HomeComponent, PostsComponent],
    imports: [CommonModule, HttpClientModule, RouterModule, SharedModule],
    exports: [HomeRoutingModule],
})
export class HomeModule {}
