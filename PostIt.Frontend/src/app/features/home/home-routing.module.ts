import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostsComponent } from './posts/posts.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { path: 'home', redirectTo: 'home/posts', pathMatch: 'full' },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {
                path: 'posts',
                component: PostsComponent,
            },
            {
                path: 'profile',
                component: ProfileComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HomeRoutingModule {}
