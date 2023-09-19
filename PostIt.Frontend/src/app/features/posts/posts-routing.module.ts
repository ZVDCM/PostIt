import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsComponent } from './posts.component';
import { FeedComponent } from './feed/feed.component';

const routes: Routes = [
    { path: 'posts', redirectTo: 'posts/feed', pathMatch: 'full' },
    {
        path: 'posts',
        component: PostsComponent,
        children: [
            {
                path: 'feed',
                component: FeedComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PostsRoutingModule {}
