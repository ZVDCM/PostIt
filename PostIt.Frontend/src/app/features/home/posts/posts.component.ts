import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { IPostItem, IPostQueryPayload } from './posts.model';
import { PostsHttpService } from './posts-http.service';
import { DeletePostHttpService } from './delete-post-http.service';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { IUser } from 'src/app/core/state/user/user.model';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { UpdatePostHttpService } from './update-post-http.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { IPost } from '../create-post.model';

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
        <ng-container *ngIf="user$ | async as user">
            <p-dialog
                *ngIf="updatePostHttp.showModal; else hideModal"
                [(visible)]="updatePostHttp.showModal"
                [modal]="true"
                [resizable]="false"
                [draggable]="false"
                [closeOnEscape]="false"
                header="Update Post"
                styleClass="w-full max-w-lg"
            >
                <div class="flex flex-col gap-2">
                    <header class="flex items-center gap-2">
                        <i
                            class="pi pi-at mt-1 text-[var(--primary-color)]"
                            style="font-size: .9rem;"
                        ></i>
                        <h1
                            class="text-base font-bold tracking-wide whitespace-nowrap group-hover:text-[var(--primary-color)]"
                        >
                            {{ user.username }}
                        </h1>
                    </header>
                    <form
                        method="POST"
                        [formGroup]="formHelper.formGroup"
                        (submit)="onSubmit()"
                    >
                        <div>
                            <textarea
                                [id]="bodyField.id"
                                [attr.aria-describedby]="bodyField.id + '-help'"
                                [formControlName]="bodyField.name"
                                rows="4"
                                (blur)="
                                    formHelper
                                        .getFormControl(bodyField.name)!
                                        .markAsDirty()
                                "
                                class="w-full resize-none"
                                style="font-size: x-large;"
                                placeholder="Changed your mind? Update your post!"
                                pInputTextarea
                            ></textarea>
                            <small
                                *ngIf="bodyField.hint !== null"
                                id="{{ bodyField.id }}-help"
                                [ngClass]="{
                                    hidden: !formHelper.isInputInvalid(
                                        bodyField.name
                                    )
                                }"
                                class="p-error"
                                >{{ bodyField.hint }}
                            </small>
                        </div>
                        <input
                            [formControlName]="bodyField.name"
                            type="text"
                            class="hidden"
                        />
                        <div class="flex flex-col gap-5 mt-10">
                            <p-button
                                [loading]="loading.isLoading"
                                type="submit"
                                styleClass="w-full"
                                label="Update post"
                            ></p-button>
                            <p-button
                                *ngIf="!loading.isLoading; else cancel"
                                (click)="updatePostHttp.showModal = false"
                                type="button"
                                styleClass="w-full p-button-outlined p-button-secondary"
                                label="Cancel"
                            ></p-button>
                            <ng-template #cancel>
                                <p-button
                                    (click)="updatePostHttp.cancelRequest()"
                                    type="button"
                                    styleClass="w-full p-button-outlined p-button-danger"
                                    label="Cancel"
                                ></p-button>
                            </ng-template>
                        </div>
                    </form>
                </div>
            </p-dialog>
            <ng-template #hideModal>
                {{ onModalHide() }}
            </ng-template>
        </ng-container>
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
    public post: IPostItem = {} as IPostItem;
    public user$: Observable<IUser> = new Observable<IUser>();
    public getAllPosts$: Observable<IPostQueryPayload> =
        new Observable<IPostQueryPayload>();
    public updatePost$: Observable<void> = new Observable<void>();
    public deletePost$: Observable<void> = new Observable<void>();

    public bodyField: IFormItem = this.homeConstants.updatePostForm['body'];

    constructor(
        public loading: LoadingService,
        public homeConstants: HomeConstantsService,
        public postsHttp: PostsHttpService,
        public formHelper: FormHelperService,
        public updatePostHttp: UpdatePostHttpService,
        private _deletePostHttp: DeletePostHttpService,

        private _store: Store
    ) {
        this.getAllPosts$ = postsHttp.watchPosts$();
        this.updatePost$ = updatePostHttp.watchUpdatePost$();
        this.deletePost$ = _deletePostHttp.watchDeletePost$();
        this.user$ = this._store.select(selectUser);
    }

    public showModal(post: IPostItem): void {
        this.post = post;
        this.updatePostHttp.showModal = true;
        this.initUpdatePostForm();
    }

    public onModalHide(): void {
        this.updatePostHttp.showModal = false;
        this.initUpdatePostForm();
    }

    public onSubmit(): void {
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            return;
        }
        this.updatePostHttp.updatePost({
            id: this.post.postId,
            ...this.formHelper.formGroup.value,
        });
    }

    private initUpdatePostForm(): void {
        this.formHelper.setFormGroup(
            new FormGroup({
                [this.bodyField.name]: new FormControl(this.post.body, [
                    Validators.required,
                ]),
            })
        );
    }
}
