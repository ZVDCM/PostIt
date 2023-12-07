import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { IPostQueryPayload } from './posts.model';
import { PostsHttpService } from './posts-http.service';
import { DeletePostHttpService } from './delete-post-http.service';

@Component({
    selector: 'app-posts',
    template: `
        <section class="min-h-screen flex flex-col gap-[2rem] pb-10">
            <app-create-post />
            <div>
                <ng-container
                    #posts
                    *ngIf="getAllPosts$ | async as posts; else empty"
                >
                    <app-post-item
                        *ngFor="let post of posts.items"
                        [post]="post"
                        class="post-item"
                    />
                </ng-container>
            </div>
            <ng-template #empty>
                {{  
                    postsHttp.getAllPosts({
                        page: 1,
                    })
                }}
            </ng-template>
        </section>
        <ng-container *ngIf="deletePost$ | async"></ng-container>
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
    public deletePost$: Observable<void> = new Observable<void>();

    constructor(
        public loading: LoadingService,
        public postsHttp: PostsHttpService,
        private _deletePostHttp: DeletePostHttpService
    ) {
        this.deletePost$ = _deletePostHttp.watchDeletePost$();
        this.getAllPosts$ = postsHttp.watchPosts$();
    }
}
