import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
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
        <loading />
    `,
    styles: [
        `
            :host {
                @apply flex h-full flex-col;
                
                position: relative;

                footer > span {
                    color: var(--surface-border);
                }
            }
        `,
    ],
})
export class AppComponent {}
