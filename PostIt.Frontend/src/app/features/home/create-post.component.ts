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
import { IPost } from './create-post.model';
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

    public bodyField: IFormItem = this.homeConstants.createPostForm['body'];

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

    public onModalHide(): void {
        this.showModal = false;
        this.initCreatePostForm();
    }

    public onSubmit(): void {
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            return;
        }
        this.createPostHttp.createPost(this.formHelper.formGroup.value);
    }

    private initCreatePostForm(): void {
        this.formHelper.setFormGroup(
            new FormGroup({
                [this.bodyField.name]: new FormControl('', [
                    Validators.required,
                ]),
            })
        );
    }
}
