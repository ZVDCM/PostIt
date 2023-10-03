import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-profile',
    template: ` <p>profile works!</p> `,
    styles: [
        `
            :host {
                @apply w-full;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {}
