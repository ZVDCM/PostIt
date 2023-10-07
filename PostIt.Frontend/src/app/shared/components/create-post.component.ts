import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/core/state/user/user.model';
import { LoadingService } from '../services/loading.service';
import { PostsHttpService } from 'src/app/features/home/posts/posts-http.service';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/core/state/user/user.selectors';

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
                [(visible)]="showModal"
                [modal]="true"
                [resizable]="false"
                [draggable]="false"
                [closeOnEscape]="false"
                header="Create Post"
                (onHide)="showModal = false"
                styleClass="w-full h-min max-w-lg"
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
                    <form method="POST">
                        <textarea
                            [autoResize]="true"
                            class="w-full"
                            style="font-size: x-large;"
                            rows="3"
                            cols="30"
                            placeholder="Got something on your mind? Post It!"
                            pInputTextarea
                        ></textarea>
                        <input type="text" class="hidden" />
                        <p-divider></p-divider>
                        <div class="flex justify-between items-center">
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
                                    (click)="postsHttp.cancelRequest()"
                                    type="button"
                                    styleClass="w-full p-button-outlined p-button-danger"
                                    label="Cancel"
                                ></p-button>
                            </ng-template>
                        </div>
                    </form>
                </div>
            </p-dialog>
        </ng-container>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePostComponent {
    public user$: Observable<IUser> = new Observable<IUser>();
    public showModal: boolean = true;

    constructor(
        public loading: LoadingService,
        public postsHttp: PostsHttpService,
        private _store: Store
    ) {
        this.user$ = this._store.select(selectUser);
    }

    public onSelect(event: any): void {
        console.log(event);
    }
}
