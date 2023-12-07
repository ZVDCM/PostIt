import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IPostItem } from 'src/app/features/home/posts/posts.model';

@Component({
    selector: 'app-post-item',
    template: `
        <article
            class="flex flex-col gap-4 p-[2.45rem] bg-[var(--surface-card)]"
        >
            <header>
                <div
                    class="flex items-center gap-2 font-bold text-[var(--primary-color)]"
                >
                    <div class="group cursor-pointer">
                        <i class="pi pi-at"></i>
                        <span class="group-hover:underline">
                            {{ post.username }}
                        </span>
                    </div>
                </div>
                <div class="flex min-h-min gap-2 text-slate-600">
                    <div>
                        <i class="pi pi-check"></i>
                        {{ post.createdOnUtc | date : 'MMM dd, yyyy' }}
                    </div>
                    •
                    <div>
                        <i class="pi pi-pencil"></i>
                        {{ post.modifiedOnUtc | date : 'MMM dd, yyyy' }}
                    </div>
                </div>
            </header>
            <p>{{ post.body }}</p>
        </article>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostItemComponent {
    @Input()
    public post: IPostItem = {} as IPostItem;

    constructor() {}
}
