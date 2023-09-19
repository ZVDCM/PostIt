import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';

@Component({
    selector: 'app-notfound',
    template: `
        <div
            class="flex flex-col justify-center items-center gap-4 font-extrabold"
        >
            <h1 class="text-7xl tracking-widest">ROUTE NOT FOUND</h1>
            <h3
                (click)="router.navigate([accountConstants.loginEndpoint])"
                class="text-5xl tracking-widest text-slate-800 cursor-pointer"
            >
                POST <span> IT </span>
            </h3>
            <span class="text-xl animate-bounce">^</span>
        </div>
    `,
    styles: [
        `
            :host {
                @apply h-full flex justify-center items-center;

                h3:hover {
                    color: white;

                    span {
                        color: var(--primary-color);
                    }
                }
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [AccountConstantsService],
})
export class NotfoundComponent {
    constructor(
        public accountConstants: AccountConstantsService,
        public router: Router
    ) {}
}
