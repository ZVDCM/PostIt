import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OneShotAuthHttpService } from './one-shot-auth-http.service';

@Component({
    selector: 'app-forgot-password',
    template: `
        <div class="w-full">
            <router-outlet />
        </div>
        <app-footer />
    `,
    styles: [
        `
            :host {
                @apply h-full max-w-3xl flex flex-col justify-start items-center mx-auto px-20;
                border-left: 1px solid var(--surface-border);
                border-right: 1px solid var(--surface-border);
                background-color: var(--surface-ground);
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {}
