import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-account',
    template: `
        <router-outlet />
        <footer
            class="flex flex-col items-center mt-auto h-[15%] font-extrabold tracking-[.3em]"
        >
            <span>ZVDCM</span>
            <span>2023</span>
        </footer>
    `,
    styles: [
        `
            :host {
                @apply h-full flex flex-col justify-center items-center;

                footer > span {
                    color: var(--surface-border);
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {}
