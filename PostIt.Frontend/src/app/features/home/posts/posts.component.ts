import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import {
    IPost,
    IPostItem,
    IPostQueryPayload,
    IUpdatePost,
} from './posts.model';
import { PostsHttpService } from './posts-http.service';
import { DeletePostHttpService } from './delete-post-http.service';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { IUser } from 'src/app/core/state/user/user.model';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { UpdatePostHttpService } from './update-post-http.service';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { CreatePostHttpService } from './create-post-http.service';

@Component({
    selector: 'app-posts',
    template: `
        <section class="min-h-screen flex flex-col gap-[2rem] pb-10">
            <app-create-post (createPost)="createPost($event)" />
            <div>
                <ng-container *ngIf="getAllPosts$ | async as posts; else empty">
                    <app-post-item
                        *ngFor="let post of posts.items"
                        [post]="post"
                        (updatePost)="showModal($event)"
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
        <app-update-post
            [showModal]="showUpdateModal"
            (hideModal)="showUpdateModal = false"
            [post]="targetPost"
            (updatePost)="updatePost($event)"
        />
        <ng-container *ngIf="createPost$ | async"></ng-container>
        <ng-container *ngIf="updatePost$ | async"></ng-container>
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
    public showUpdateModal: boolean = false;
    public targetPost: IPostItem = {} as IPostItem;
    public user$: Observable<IUser> = new Observable<IUser>();
    public getAllPosts$: Observable<IPostQueryPayload> =
        new Observable<IPostQueryPayload>();
    public createPost$: Observable<void> = new Observable<void>();
    public updatePost$: Observable<void> = new Observable<void>();
    public deletePost$: Observable<void> = new Observable<void>();

    public bodyField: IFormItem = this.homeConstants.updatePostForm['body'];

    constructor(
        public loading: LoadingService,
        public homeConstants: HomeConstantsService,
        public postsHttp: PostsHttpService,
        public formHelper: FormHelperService,
        private _createPostHttp: CreatePostHttpService,
        private _updatePostHttp: UpdatePostHttpService,
        private _deletePostHttp: DeletePostHttpService,
        private _store: Store
    ) {
        this.user$ = _store.select(selectUser);
        this.getAllPosts$ = postsHttp.watchPosts$();
        this.createPost$ = _createPostHttp.watchCreatePost$().pipe(
            tap(() => {
                postsHttp.getAllPosts({ page: 1 });
            })
        );
        this.updatePost$ = _updatePostHttp.watchUpdatePost$().pipe(
            tap(() => {
                postsHttp.getAllPosts({ page: 1 });
            })
        );
        this.deletePost$ = _deletePostHttp.watchDeletePost$().pipe(
            tap(() => {
                postsHttp.getAllPosts({ page: 1 });
            })
        );
    }

    public showModal(post: IPostItem): void {
        this.targetPost = post;
        this.showUpdateModal = true;
    }

    public createPost(post: IPost): void {
        this._createPostHttp.createPost(post);
    }

    public updatePost([postId, post]: [string, IUpdatePost]): void {
        this._updatePostHttp.updatePost(postId, post);
    }
}
