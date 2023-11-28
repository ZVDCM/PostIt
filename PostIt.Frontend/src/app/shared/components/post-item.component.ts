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
                    class="group flex items-center gap-2 font-bold text-[var(--primary-color)] cursor-pointer"
                >
                    <i class="pi pi-at"></i>
                    <span class="group-hover:underline">
                        {{ post.username }}
                    </span>
                </div>
                <div class="flex text-slate-600">
                    {{ post.createdOnUtc | date : 'MMM dd, yyyy' }}
                    <p-divider layout="vertical"></p-divider>
                    {{ post.modifiedOnUtc | date : 'MMM dd, yyyy' }}
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
