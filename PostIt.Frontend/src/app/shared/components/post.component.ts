import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-post-item',
    template: ` <p>post works!</p> `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {}
