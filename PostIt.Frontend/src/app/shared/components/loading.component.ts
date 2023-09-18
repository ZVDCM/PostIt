import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'loading',
    template: `
        <div
            class="relative"
            *ngIf="
                (isLoading$ | async) && (loading.progress$ | async) as progress
            "
        >
            <div
                id="loading-background"
                class="h-1"
                style="background-color: gray"
            ></div>
            <div
                id="loading-foreground"
                class="absolute top-0 left-0 h-1 transition-all"
                [style.width]="progress + '%'"
                [ngStyle]="{
                    backgroundColor: loading.isCancelled
                        ? 'var(--error-color)'
                        : 'var(--primary-color)'
                }"
            ></div>
        </div>
    `,
    styles: [
        `
            :host {
                @apply fixed top-0 left-0 w-full;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
    public isLoading$: Observable<boolean> = new Observable<boolean>();

    constructor(public loading: LoadingService) {
        this.isLoading$ = this.loading.watchLoading();
    }
}
