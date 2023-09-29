import { Injectable } from '@angular/core';
import { Observable, Subject, tap, timer } from 'rxjs';
import { ProgressService } from './progress.service';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    public readonly millisecondsDelay = 1000;
    private _loading$$: Subject<boolean> = new Subject<boolean>();

    public isLoading: boolean = false;

    constructor(private _progress: ProgressService) {}

    public watchLoading$(): Observable<boolean> {
        return this._loading$$.asObservable();
    }

    public startLoading(): void {
        this.isLoading = true;
        this._loading$$.next(true);
    }

    public endLoading(): void {
        this.isLoading = false;
        this._progress.endProgress();
        timer(this.millisecondsDelay)
            .pipe(
                tap(() => {
                    this._loading$$.next(false);
                })
            )
            .subscribe();
    }
}
