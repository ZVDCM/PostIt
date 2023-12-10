import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { PostsHttpService } from '../../shared/services/posts/posts-http.service';
import { FormHelperService } from 'src/app/shared/utils/form-helper.service';
import { UpdatePostHttpService } from '../../shared/services/posts/update-post-http.service';
import { IFormItem } from 'src/app/core/models/form.model';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/state/user/user.model';
import { Store } from '@ngrx/store';
import { IPostItem } from 'src/app/core/models/posts.model';

@Component({
    selector: 'app-update-post',
    template: `
        <ng-container *ngIf="user$ | async as user">
            <p-dialog
                *ngIf="showModal; else hideModal"
                [(visible)]="showModal"
                [modal]="true"
                [resizable]="false"
                [draggable]="false"
                [closeOnEscape]="false"
                header="Update Post"
                styleClass="w-full max-w-lg"
            >
                {{ setPost() }}
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
                                (input)="isEditing = true"
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
                                (click)="showModal = false"
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
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePostComponent {
    public post: IPostItem = {} as IPostItem;
    public user$: Observable<IUser> = new Observable<IUser>();
    public updatePost$: Observable<void> = new Observable<void>();
    public bodyField: IFormItem = this.homeConstants.updatePostForm['body'];
    public isEditing: boolean = false;

    @Input()
    public showModal: boolean = false;
    @Output()
    public updatePost: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    public hideModal: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public loading: LoadingService,
        public homeConstants: HomeConstantsService,
        public postsHttp: PostsHttpService,
        public formHelper: FormHelperService,
        public updatePostHttp: UpdatePostHttpService,
        private _store: Store
    ) {
        this.user$ = _store.select(selectUser);
    }

    public setPost(): void {
        if (this.isEditing) return;
        this.post = this.updatePostHttp.post;
        this.initUpdatePostForm();
    }

    public onModalHide(): void {
        this.hideModal.emit();
        this.isEditing = false;
        this.post = {} as IPostItem;
        this.initUpdatePostForm();
    }

    public onSubmit(): void {
        if (this.formHelper.formGroup.invalid) {
            this.formHelper.validateAllFormInputs();
            return;
        }
        this.updatePost.emit(
            this.formHelper.formGroup.value[this.bodyField.name]
        );
        this.hideModal.emit();
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
