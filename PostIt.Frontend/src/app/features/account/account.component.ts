import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-account',
    template: ` <router-outlet /> `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {}
