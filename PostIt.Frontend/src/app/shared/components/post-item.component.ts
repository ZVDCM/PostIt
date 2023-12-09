import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DeletePostHttpService } from 'src/app/shared/services/delete-post-http.service';
import { IPostItem } from 'src/app/core/models/posts.model';

@Component({
    selector: 'app-post-item',
    template: `
        <article
            class="flex flex-col pt-[2.45rem] gap-4 bg-[var(--surface-card)]"
        >
            <header class="flex px-[2.45rem]">
                <div class="flex-grow">
                    <div class="flex">
                        <div
                            class="flex gap-2 items-center group cursor-pointer font-bold text-[var(--primary-color)]"
                        >
                            <i class="pi pi-at" style="font-size: .9rem;"></i>
                            <span class="text-[1.1rem] group-hover:underline">
                                {{ post.username }}
                            </span>
                        </div>
                    </div>
                    <div class="flex min-h-min gap-2 text-slate-600">
                        <small>
                            <i class="pi pi-check" style="font-size: .6rem"></i>
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
                                {{ post.modifiedOnUtc | date : 'MMM dd, yyyy' }}
                            </div>
                        </small>
                    </div>
                </div>
                <div>
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
                (click)="isLiked = !isLiked"
                style="border-radius: 0"
                [ngStyle]="{
                    'border-top': isLiked ? '':'1px solid var(--surface-border)',
                }"
            >
                <i class="pi pi-thumbs-up"></i>
                <span> Like </span>
            </button>
        </article>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent {
    public isLiked: boolean = false;
    @Input()
    public post: IPostItem = {} as IPostItem;
    public items: MenuItem[] = [];

    @Output()
    public updatePost: EventEmitter<IPostItem> = new EventEmitter<IPostItem>();

    constructor(private _deletePostHttp: DeletePostHttpService) {
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

    public hasBeenModified(modifiedOnUtc: Date) {
        return modifiedOnUtc > new Date(0);
    }
}
