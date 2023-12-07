import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { IPostQueryPayload } from './posts.model';
import { PostsHttpService } from './posts-http.service';

@Component({
    selector: 'app-posts',
    template: `
        <section class="min-h-screen flex flex-col gap-[2rem] pb-10">
            <app-create-post />
            <div #posts *ngIf="getAllPosts$ | async as posts; else empty">
                <app-post-item
                    *ngFor="let post of posts.items"
                    [post]="post"
                    class="post-item"
                />
            </div>
            <ng-template #empty>
                {{  
                    postsHttp.getAllPosts({
                        page: 1,
                    })
                }}
            </ng-template>
        </section>
    `,
    styles: [
        `
            :host {
                ::ng-deep .post-item:not(:last-child) {
                    article {
                        margin-bottom: 1rem;
                    }
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
    public getAllPosts$: Observable<IPostQueryPayload> =
        new Observable<IPostQueryPayload>();

    constructor(
        public loading: LoadingService,
        public postsHttp: PostsHttpService
    ) {
        this.getAllPosts$ = postsHttp.watchPosts$();
    }
}
