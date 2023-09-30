import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressService } from '../services/progress.service';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Component({
    selector: 'app-loading',
    template: `
        <div
            class="relative"
            *ngIf="
                (loading$ | async) && (progress$ | async) as _progress;
                else endLoading
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
                [style.width]="_progress + '%'"
                [ngStyle]="{
                    backgroundColor:
                        progress.isCancelled === null
                            ? 'var(--error-color)'
                            : 'var(--primary-color)'
                }"
            ></div>
        </div>
        <ng-template #endLoading> {{ resetProgress() }} </ng-template>
    `,
    styles: [
        `
            :host {
                @apply fixed top-0 left-0 w-full z-[9999];
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
    public loading$: Observable<boolean> = new Observable<boolean>();
    public progress$: Observable<number> = new Observable<number>();

    constructor(
        public progress: ProgressService,
        public loading: LoadingService
    ) {
        this.loading$ = this.loading.watchLoading$();
        this.progress$ = this.progress.watchProgress$();
    }

    public resetProgress(): void {
        this.progress$ = this.progress.watchProgress$();
    }
}
