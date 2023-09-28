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
    timer,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private readonly _start: number = 0;
    private readonly _end: number = 100;
    private readonly _min: number = 1;
    private readonly _max: number = 9;
    private readonly _millisecondsPerTick = 500;
    private readonly _millisecondsDelay = 500;
    private _stopInterval$$: Subject<void> = new Subject<void>();
    private _isLoading$$: Subject<boolean> = new Subject<boolean>();

    public progress$: Observable<number> = this.start();
    public isCancelled: boolean = false;

    public showLoading(): boolean {
        this._isLoading$$.next(true);
        this.isCancelled = false;
        return true;
    }

    public watchLoading(): Observable<boolean> {
        return this._isLoading$$
            .asObservable()
            .pipe(
                tap((isLoading) => isLoading && (this.progress$ = this.start()))
            );
    }

    public endLoading(): boolean {
        this._stopInterval$$.next();
        return false;
    }

    private start(): Observable<number> {
        return concat(
            interval(this._millisecondsPerTick).pipe(
                startWith(0),
                tap((sum) => this.checkProgress(sum)),
                scan((sum, _) => sum + this.randomValue(sum), this._start),
                takeUntil(this._stopInterval$$)
            ),
            of(this._end),
            timer(this._millisecondsDelay).pipe(
                tap((_) => this._isLoading$$.next(false))
            )
        );
    }

    private checkProgress(progress: number): void {
        if (progress === this._end) {
            this.endLoading();
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
