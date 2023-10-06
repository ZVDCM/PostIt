import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-for-you',
    template: ` for you `,
    styles: [``],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForYouComponent {
    constructor() {}
}
