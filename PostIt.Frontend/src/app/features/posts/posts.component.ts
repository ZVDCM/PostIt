import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-posts',
    template: `
        <aside
            class="h-full flex-1 sticky top-0"
            style="border-right: 1px solid var(--surface-border); background-color: var(--surface-ground)"
        ></aside>
        <div
            class="w-full max-w-3xl"
            style="border-right: 1px solid var(--surface-border); background-color: var(--surface-ground)"
        >
            <router-outlet />
        </div>
        <aside class="h-full flex-1 sticky top-0"></aside>
        <div
            class="fixed top-0 right-0 flex flex-col items-end p-5 font-extrabold text-slate-600"
        >
            <div class="space-x-2">
                <span>Z</span>
                <span>V</span>
                <span>D</span>
                <span>C</span>
                <span>M</span>
            </div>
            <div class="space-x-2">
                <span>2</span>
                <span>0</span>
                <span>2</span>
                <span>3</span>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                @apply h-[10000px] relative flex;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {}
