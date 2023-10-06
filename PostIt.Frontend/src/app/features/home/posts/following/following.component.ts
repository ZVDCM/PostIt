import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-following',
    template: ` <p>following works!</p> `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowingComponent {}
