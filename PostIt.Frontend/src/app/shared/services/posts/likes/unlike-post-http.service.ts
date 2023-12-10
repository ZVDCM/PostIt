import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
    Observable,
    Subject,
    catchError,
    filter,
    finalize,
    of,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { ProgressService } from '../../progress.service';
import { LoadingService } from '../../loading.service';
import { HomeConstantsService } from '../../../constants/home-constants.service';
import { ServerConstantsService } from '../../../constants/server-constants.service';

@Injectable({
    providedIn: 'root',
})
export class UnlikePostHttpService {
    private readonly _url: string = this._serverConstants.serverApi;
    private _unlikePost$$: Subject<string> = new Subject<string>();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService
    ) {}

    public watchUnlikePost$(): Observable<void> {
        return this._unlikePost$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((id: string) =>
                this._unlikePost$(id).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    })
                )
            ),
            catchError((err) =>
                of(err).pipe(
                    filter((err) => err instanceof HttpErrorResponse),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap((err) => {
                        switch (err.status) {
                            case 400: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Invalid form data',
                                });
                                break;
                            }
                            case 401: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'User unauthorized',
                                });
                                break;
                            }
                            case 403: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Invalid user credentials',
                                });
                                break;
                            }
                            default: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail:
                                        err.error?.detail ??
                                        'Something went wrong',
                                });
                                break;
                            }
                        }
                    }),
                    switchMap(() => this.watchUnlikePost$())
                )
            ),
            finalize(() => {
                if (this._progress.isCancelled) {
                    this._progress.isCancelled = null;
                    this._loading.endLoading();
                }
            })
        );
    }

    public cancelRequest(): void {
        if (this._loading.isLoading) {
            this._progress.isCancelled = null;
            this._loading.endLoading();
            this._cancelRequest$$.next();
        }
    }

    public unlikePost(id: string): void {
        this._unlikePost$$.next(id);
    }

    private _unlikePost$(id: string): Observable<void> {
        return this._httpClient.post<void>(
            this._url + this._homeConstants.unlikePostEndpoint(id),
            {}
        );
    }
}
