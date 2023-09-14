import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-notfound',
    template: ` <p>notfound</p> `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotfoundComponent {}
