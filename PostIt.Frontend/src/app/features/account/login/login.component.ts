import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-login',
    template: ` <p class="text-center">login works!</p> `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {}
