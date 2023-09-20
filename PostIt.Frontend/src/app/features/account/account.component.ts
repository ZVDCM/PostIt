import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-account',
    template: `
        <div class="w-full">
            <router-outlet />
        </div>
        <footer
            class="flex flex-col items-center mt-auto h-[15%] font-extrabold text-slate-600"
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
        </footer>
    `,
    styles: [
        `
            :host {
                @apply h-full max-w-3xl flex flex-col justify-center items-center mx-auto px-20;
                border-left: 1px solid var(--surface-border);
                border-right: 1px solid var(--surface-border);
                background-color: var(--surface-ground);
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {}
