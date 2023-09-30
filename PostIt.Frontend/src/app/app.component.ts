import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
        <main class="h-full relative z-[2]">
            <router-outlet />
        </main>
        <app-loading />
        <p-toast />
    `,
    styles: [
        `
            :host {
                @apply h-full relative;

                main::after {
                    @apply fixed top-[-8rem] left-0 text-[20rem] font-extrabold tracking-widest whitespace-nowrap text-slate-900 select-none pointer-events-none z-[-1];
                    content: 'POST IT';
                }

                main::before {
                    @apply fixed bottom-[-5rem] right-0 text-[20rem] font-extrabold tracking-widest whitespace-nowrap text-slate-900 select-none pointer-events-none z-[-1];
                    content: 'POST IT';
                }

                footer > span {
                    color: var(--surface-border);
                }
            }
        `,
    ],
})
export class AppComponent {}
