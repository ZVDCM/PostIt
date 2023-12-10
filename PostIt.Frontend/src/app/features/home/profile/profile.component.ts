import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/state/user/user.model';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { Clipboard } from '@angular/cdk/clipboard';
import { MessageService } from 'primeng/api';
import {
    IPost,
    IPostItem,
    IPostQueryPayload,
    IUpdatePost,
} from '../../../core/models/posts.model';
import { UserPostsHttpService } from '../../../shared/services/user-posts-http.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { UpdatePostHttpService } from '../../../shared/services/update-post-http.service';
import { DeletePostHttpService } from '../../../shared/services/delete-post-http.service';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { CreatePostHttpService } from '../../../shared/services/create-post-http.service';

@Component({
    selector: 'app-profile',
    template: `
        <ng-container *ngIf="user$ | async as user">
            <header
                class="flex flex-col gap-4 px-10 py-[3.12rem] bg-[var(--surface-card)] border-b-2 border-[var(--surface-border)]"
            >
                <section class="flex items-center">
                    <div
                        class="group flex items-center gap-4 cursor-pointer"
                        (click)="onUsernameClick(user.username)"
                    >
                        <i class="pi pi-at mt-1" style="font-size: 1.5rem;"></i>
                        <h1
                            class="text-3xl font-extrabold tracking-wide whitespace-nowrap group-hover:text-[var(--primary-color)]"
                        >
                            {{ user.username }}
                        </h1>
                    </div>
                    <i
                        class="pi pi-verified ml-auto mt-1 text-[var(--primary-color)]"
                        style="font-size: 1.3rem;"
                    ></i>
                </section>
                <section class="flex justify-between items-center">
                    <span class="flex items-center gap-2 text-slate-600">
                        <i class="pi pi-calendar"></i>
                        Joined {{ user.createdOnUtc | date : 'MMM dd, yyyy' }}
                    </span>
                </section>
            </header>
            <section class="min-h-screen flex flex-col gap-[2rem]">
                <app-create-post (createPost)="createPost($event)" />
                <div>
                    <ng-container
                        *ngIf="getAllUserPosts$ | async as posts; else empty"
                    >
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
                        user.id && userPostsHttp.getAllUserPosts(user.id,{
                            page: 1,
                        })
                    }}
                    <div class="mb-[1rem] p-[2.45rem] bg-[var(--surface-card)]">
                        <p-skeleton
                            width="10rem"
                            styleClass="mb-2"
                        ></p-skeleton>
                        <p-skeleton width="5rem" styleClass="mb-2"></p-skeleton>
                        <p-skeleton height="4rem"></p-skeleton>
                    </div>
                    <div class="mb-[1rem] p-[2.45rem] bg-[var(--surface-card)]">
                        <p-skeleton
                            width="10rem"
                            styleClass="mb-2"
                        ></p-skeleton>
                        <p-skeleton width="5rem" styleClass="mb-2"></p-skeleton>
                        <p-skeleton height="4rem"></p-skeleton>
                    </div>
                    <div class="p-[2.45rem] bg-[var(--surface-card)]">
                        <p-skeleton
                            width="10rem"
                            styleClass="mb-2"
                        ></p-skeleton>
                        <p-skeleton width="5rem" styleClass="mb-2"></p-skeleton>
                        <p-skeleton height="4rem"></p-skeleton>
                    </div>
                </ng-template>
            </section>
        </ng-container>
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
                ::ng-deep p-fileUpload {
                    .p-fileupload-content {
                        @apply hidden;
                    }

                    .p-fileupload-buttonbar {
                        @apply border-0 h-min w-min p-0;

                        .p-button {
                            @apply m-0 p-4;

                            .p-button-icon {
                                @apply m-0;
                            }

                            .p-button-label {
                                @apply hidden;
                            }
                        }
                    }
                }

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
export class ProfileComponent {
    public showUpdateModal: boolean = false;
    public targetPost: IPostItem = {} as IPostItem;
    public user$: Observable<IUser> = new Observable<IUser>();
    public getAllUserPosts$: Observable<IPostQueryPayload> =
        new Observable<IPostQueryPayload>();
    public createPost$: Observable<void> = new Observable<void>();
    public updatePost$: Observable<void> = new Observable<void>();
    public deletePost$: Observable<void> = new Observable<void>();

    public bodyField: IFormItem = this.homeConstants.updatePostForm['body'];

    constructor(
        public loading: LoadingService,
        public homeConstants: HomeConstantsService,
        public userPostsHttp: UserPostsHttpService,
        public formHelper: FormHelperService,
        private _createPostHttp: CreatePostHttpService,
        private _updatePostHttp: UpdatePostHttpService,
        private _deletePostHttp: DeletePostHttpService,
        private _store: Store,
        private _clipboard: Clipboard,
        private _messageService: MessageService
    ) {
        this.user$ = _store.select(selectUser);
        this.getAllUserPosts$ = userPostsHttp.watchUserPosts$();
        this.createPost$ = _createPostHttp.watchCreatePost$();
        this.updatePost$ = _updatePostHttp.watchUpdatePost$();
        this.deletePost$ = _deletePostHttp.watchDeletePost$();
    }

    public onUsernameClick(username: string): void {
        this._clipboard.copy(username);
        this._messageService.add({
            severity: 'info',
            summary: 'Copied to Clipboard',
            detail: 'You have copied username to clipboard',
        });
    }

    public showModal(post: IPostItem): void {
        this.targetPost = post;
        this.showUpdateModal = true;
        console.log(1);
    }

    public createPost(post: IPost): void {
        this._createPostHttp.createPost(post);
    }

    public updatePost([postId, post]: [string, IUpdatePost]): void {
        this._updatePostHttp.updatePost(postId, post);
    }
}
