import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsHttpService } from '../posts-http.service';
import { IPostQueryPayload } from '../posts.model';

@Component({
    selector: 'app-for-you',
    template: `
        <div #posts *ngIf="getAllPosts$ | async as posts; else empty">
            <app-post-item *ngFor="let post of posts.items" [post]="post" />
        </div>
        <ng-template #empty>
            {{  postsHttp.getAllPosts({
                    page: 1,
                })
            }}
        </ng-template>
    `,
    styles: [
        `
            :host {
                @apply flex flex-col gap-4;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForYouComponent {
    public getAllPosts$: Observable<IPostQueryPayload> =
        new Observable<IPostQueryPayload>();

    constructor(public postsHttp: PostsHttpService) {
        this.getAllPosts$ = postsHttp.watchPosts$();
    }
}
