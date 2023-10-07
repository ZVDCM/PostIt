import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-for-you',
    template: ``,
    styles: [
        `
            :host {
                @apply flex flex-col gap-4;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForYouComponent {
    constructor() {}
}
