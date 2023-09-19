import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-account',
    template: `
        <span
            class="fixed top-[-8rem] left-0 text-[20rem] font-extrabold tracking-widest whitespace-nowrap text-slate-900 select-none"
        >
            POST IT
        </span>
        <span
            class="fixed bottom-[-5rem] right-0 text-[20rem] font-extrabold tracking-widest whitespace-nowrap text-slate-900 select-none"
        >
            POST IT
        </span>
        <router-outlet />
        <footer
            class="flex flex-col items-center mt-auto h-[15%] font-extrabold text-slate-600 z-[1]"
        >
            <div class="space-x-2">
                <span>Z</span>
                <span>V</span>
                <span>D</span>
                <span>C</span>
                <span>M</span>
            </div>
            <div class="space-x-2">
                <span>2</span>
                <span>0</span>
                <span>2</span>
                <span>3</span>
            </div>
        </footer>
    `,
    styles: [
        `
            :host {
                @apply h-full flex flex-col justify-center items-center;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {}
