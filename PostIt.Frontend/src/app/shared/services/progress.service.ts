import { Injectable } from '@angular/core';
import {
    Observable,
    Subject,
    concat,
    interval,
    of,
    scan,
    startWith,
    takeUntil,
    tap,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProgressService {
    private readonly _start: number = 0;
    private readonly _end: number = 100;
    private readonly _min: number = 1;
    private readonly _max: number = 5;
    private readonly _millisecondsPerTick = 500;
    private _stopInterval$$: Subject<void> = new Subject<void>();

    public isCancelled: boolean | null = null;

    public endProgress(): void {
        this._stopInterval$$.next();
    }

    public watchProgress$(): Observable<number> {
        this.isCancelled = null;
        return concat(
            interval(this._millisecondsPerTick).pipe(
                startWith(0),
                tap((sum) => this.checkProgress(sum)),
                scan((sum, _) => sum + this.randomValue(sum), this._start),
                takeUntil(this._stopInterval$$)
            ),
            of(this._end)
        );
    }

    private checkProgress(progress: number): void {
        if (progress === this._end) {
            this.endProgress();
        }
    }

    private randomValue(progress: number): number {
        let value: number = 0;
        if (progress > this._end - this._max) {
            const diff: number = this._end - progress;
            const half: number = Math.floor(diff / 2);
            value = Math.floor(Math.random() * (diff - half + 1)) + half;
        } else {
            value =
                Math.floor(Math.random() * (this._max - this._min + 1)) +
                this._min;
        }
        return value;
    }
}
