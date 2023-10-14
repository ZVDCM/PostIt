import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/state/user/user.model';
import { LoadingService } from '../../shared/services/loading.service';
import { PostsHttpService } from 'src/app/features/home/posts/posts-http.service';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { HomeConstantsService } from '../../shared/constants/home-constants.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { FormHelperService } from '../../shared/utils/form-helper.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IImage, IPost } from './create-post.model';
import { CreatePostHttpService } from './create-post-http.service';

@Component({
    selector: 'app-create-post',
    template: `
        <section
            class="flex justify-between items-center gap-4 p-[2.45rem] bg-[var(--surface-card)]"
        >
            <i
                class="pi pi-at text-[var(--primary-color)]"
                style="font-size: 2rem"
            ></i>
            <input
                [readOnly]="true"
                (click)="showModal = true"
                pInputText
                id="create-post"
                placeholder="Got something on your mind? Post It!"
                type="text"
                class="w-full cursor-pointer"
                style="border: none"
            />
        </section>
        <ng-container *ngIf="user$ | async as user">
            <p-dialog
                *ngIf="showModal; else hideModal"
                [(visible)]="showModal"
                [modal]="true"
                [resizable]="false"
                [draggable]="false"
                [closeOnEscape]="false"
                header="Create Post"
                styleClass="w-full max-w-lg"
            >
                <div class="flex flex-col gap-2">
                    <header class="flex items-center gap-2">
                        <i
                            class="pi pi-at mt-1 text-[var(--primary-color)]"
                            style="font-size: 1rem;"
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
                                placeholder="Got something on your mind? Post It!"
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
                        <p-divider></p-divider>
                        <div
                            *ngIf="!image; else imageItem"
                            class="flex justify-between items-center"
                        >
                            <span>Add to your post</span>
                            <p-fileUpload
                                [showUploadButton]="false"
                                [showCancelButton]="false"
                                [maxFileSize]="1000000"
                                (onSelect)="onSelect($event)"
                                method="post"
                                accept="image/*"
                                chooseIcon="pi pi-image"
                                chooseStyleClass="p-button-rounded p-button-secondary p-button-outlined"
                            >
                            </p-fileUpload>
                        </div>
                        <ng-template #imageItem>
                            <div
                                class="max-h-[5rem] flex justify-between items-center rounded-md border border-[var(--surface-border)]"
                            >
                                <figure
                                    class="max-h-[5rem] w-[150px] overflow-hidden rounded-l-md"
                                >
                                    <img
                                        width="100%"
                                        height="100%"
                                        class="object-cover"
                                        [src]="image?.url"
                                        [alt]="image?.name"
                                    />
                                </figure>
                                <span
                                    class="max-w-[150px] text-ellipsis whitespace-nowrap overflow-clip"
                                    >{{ image?.name?.fileName }}</span
                                >.{{ image?.name?.fileType }}
                                <button
                                    type="button"
                                    icon="pi pi-times"
                                    class="p-button-danger"
                                    style="border-top-left-radius: 0; border-bottom-left-radius: 0; height: 5rem"
                                    pButton
                                ></button>
                            </div>
                        </ng-template>
                        <div class="flex flex-col gap-5 mt-10">
                            <p-button
                                [loading]="loading.isLoading"
                                type="submit"
                                styleClass="w-full"
                                label="Create post"
                            ></p-button>
                            <p-button
                                *ngIf="!loading.isLoading; else cancel"
                                (click)="showModal = false"
                                type="button"
                                styleClass="w-full p-button-outlined p-button-secondary"
                                label="Cancel"
                            ></p-button>
                            <ng-template #cancel>
                                <p-button
                                    (click)="createPostHttp.cancelRequest()"
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
        <ng-container *ngIf="createPost$ | async"></ng-container>
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
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [FormHelperService],
})
export class CreatePostComponent {
    public user$: Observable<IUser> = new Observable<IUser>();
    public createPost$: Observable<void> = new Observable<void>();
    public showModal: boolean = false;
    public image: IImage | null = null;

    public bodyField: IFormItem = this.homeConstants.createPostForm['body'];
    public imageField: IFormItem = this.homeConstants.createPostForm['image'];

    constructor(
        public homeConstants: HomeConstantsService,
        public loading: LoadingService,
        public createPostHttp: CreatePostHttpService,
        public formHelper: FormHelperService,
        private _store: Store
    ) {
        this.createPost$ = createPostHttp.watchCreatePost$();
        this.user$ = this._store.select(selectUser);
        this.initCreatePostForm();
    }

    public onSelect(event: any): void {
        const image = event.files[0];
        const imageNameItems = image.name.split('.');
        this.image = {
            name: {
                fileName: imageNameItems.shift(),
                fileType: imageNameItems.pop(),
            },
            url: URL.createObjectURL(image),
            file: image,
        };
        this.formHelper
            .getFormControl(this.imageField.name)!
            .setValue(image.name);
    }

    public onModalHide(): void {
        this.showModal = false;
        this.initCreatePostForm();
    }

    public onSubmit(): void {
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            return;
        }
        const post: IPost = {
            ...this.formHelper.formGroup.value,
            file: this.image?.file,
        };
        this.createPostHttp.createPost(post);
    }

    private initCreatePostForm(): void {
        this.formHelper.setFormGroup(
            new FormGroup({
                [this.bodyField.name]: new FormControl('', [
                    Validators.required,
                ]),
                [this.imageField.name]: new FormControl(''),
            })
        );

        this.image = null;
    }
}
