import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <footer
            class="flex flex-col items-center mt-auto h-[15%] font-extrabold text-slate-600"
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
                @apply fixed bottom-20
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
