import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { HomeRoutingModule } from './home-routing.module';
import { PostsComponent } from './posts/for-you.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
    declarations: [HomeComponent, PostsComponent, ProfileComponent],
    imports: [CommonModule, HttpClientModule, RouterModule, SharedModule],
    exports: [HomeRoutingModule],
})
export class HomeModule {}
