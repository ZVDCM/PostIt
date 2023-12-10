import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DeletePostHttpService } from 'src/app/shared/services/posts/delete-post-http.service';
import { IPostItem } from 'src/app/core/models/posts.model';
import { LikePostHttpService } from '../services/posts/likes/like-post-http.service';
import { Observable, debounceTime, fromEvent, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UnlikePostHttpService } from '../services/posts/likes/unlike-post-http.service';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/core/state/user/user.selectors';
import { IUser } from 'src/app/core/state/user/user.model';

@Component({
    selector: 'app-post-item',
    template: `
        <ng-container *ngIf="user$ | async as user">
            <article
                class="flex flex-col pt-[2.45rem] gap-4 bg-[var(--surface-card)]"
            >
                <header class="flex px-[2.45rem]">
                    <div class="flex-grow">
                        <div
                            class="flex gap-2 items-center font-bold text-[var(--primary-color)]"
                        >
                            <i class="pi pi-at" style="font-size: .9rem;"></i>
                            <span class="text-[1.1rem]">
                                {{ post.username }}
                            </span>
                        </div>
                        <div class="flex min-h-min gap-2 text-slate-600">
                            <small>
                                <i
                                    class="pi pi-check"
                                    style="font-size: .6rem"
                                ></i>
                                {{ post.createdOnUtc | date : 'MMM dd, yyyy' }}
                            </small>
                            <small
                                class="flex gap-2"
                                *ngIf="hasBeenModified(post.modifiedOnUtc)"
                            >
                                •
                                <div>
                                    <i
                                        class="pi pi-pencil"
                                        style="font-size: .6rem"
                                    ></i>
                                    {{
                                        post.modifiedOnUtc
                                            | date : 'MMM dd, yyyy'
                                    }}
                                </div>
                            </small>
                        </div>
                    </div>
                    <div *ngIf="user.id === post.userId">
                        <p-menu #menu [model]="items" [popup]="true"></p-menu>
                        <button
                            pButton
                            type="button"
                            class="p-button-text relative"
                            (click)="menu.toggle($event)"
                            icon="pi pi-bars"
                        ></button>
                    </div>
                </header>
                <div class="px-[2.45rem]">
                    <p>{{ post.body }}</p>
                    <p class="mt-[2rem] text-slate-600">
                        <i class="pi pi-thumbs-up"></i> {{ post.likesCount }}
                    </p>
                </div>
                <button
                    pButton
                    pRipple
                    class="flex justify-center items-center gap-4"
                    [ngClass]="{
                        'p-button-primary': isLiked,
                        'p-button-text': !isLiked
                    }"
                    style="border-radius: 0"
                    [ngStyle]="{
                    'border-top': isLiked ? '':'1px solid var(--surface-border)',
                }"
                    (click)="like()"
                >
                    <i class="pi pi-thumbs-up"></i>
                    <span> Like </span>
                </button>
            </article>
        </ng-container>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent implements AfterViewInit {
    public user$: Observable<IUser> = new Observable<IUser>();
    private _clickControl = new FormControl();
    public isLiked: boolean = false;
    @Input()
    public post: IPostItem = {} as IPostItem;
    public items: MenuItem[] = [];

    @Output()
    public updatePost: EventEmitter<IPostItem> = new EventEmitter<IPostItem>();

    constructor(
        public likePostHttp: LikePostHttpService,
        public unlikePostHttp: UnlikePostHttpService,
        private _deletePostHttp: DeletePostHttpService,
        private _cdr: ChangeDetectorRef,
        private _store: Store
    ) {
        this.user$ = this._store.select(selectUser);
        this._clickControl.valueChanges
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.isLiked
                    ? this.likePostHttp.likePost(this.post.postId)
                    : this.unlikePostHttp.unlikePost(this.post.postId);
            });
        this.items = [
            {
                label: 'Update',
                icon: 'pi pi-pencil',
                command: () => this.updatePost.emit(this.post),
            },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                command: () => _deletePostHttp.deletePost(this.post.postId),
            },
        ];
    }

    ngAfterViewInit(): void {
        this._store
            .select(selectUser)
            .subscribe((user) =>
                this.post.likes.forEach(
                    (like) => user.id === like.userId && (this.isLiked = true)
                )
            );
        this._cdr.detectChanges();
    }

    public like() {
        this.isLiked = !this.isLiked;
        this._clickControl.setValue(Date.now());
    }

    public hasBeenModified(modifiedOnUtc: Date) {
        return modifiedOnUtc > new Date(0);
    }
}
