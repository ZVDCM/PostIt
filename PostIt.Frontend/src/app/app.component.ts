import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
        <main class="h-full">
            <router-outlet />
        </main>
        <loading />
    `,
    styles: [
        `
            :host {
                position: relative;

                footer > span {
                    color: var(--surface-border);
                }
            }
        `,
    ],
})
export class AppComponent {}
