import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-following',
    template: ` <p>following works!</p> `,
    styles: [
        `
            :host {
                @apply flex flex-col gap-4;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowingComponent {}
