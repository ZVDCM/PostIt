import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-account',
    template: `
        <main class="block h-full">
            <router-outlet />
        </main>
        <footer
            class="flex flex-col items-center mt-auto h-2/5 font-extrabold tracking-[.3em]"
        >
            <span>ZVDCM</span>
            <span>2023</span>
        </footer>
    `,
    styles: [
        `
            :host {
                @apply flex h-full flex-col;

                footer > span {
                    color: var(--surface-border);
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {}
