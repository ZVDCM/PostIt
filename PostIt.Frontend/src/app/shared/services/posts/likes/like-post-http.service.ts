import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import { ServerConstantsService } from '../../../constants/server-constants.service';
import { HomeConstantsService } from '../../../constants/home-constants.service';
import { LoadingService } from '../../loading.service';
import { ProgressService } from '../../progress.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class LikePostHttpService {
    private readonly _url: string = this._serverConstants.serverApi;
    private _likePost$$: Subject<string> = new Subject<string>();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService,
    ) {}

    public watchLikePost$(): Observable<void> {
        return this._likePost$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((id: string) =>
                this._likePost$(id).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
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
                                    detail: 'Invalid user credentials or verification',
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
                    switchMap(() => this.watchLikePost$())
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

    public likePost(id: string): void {
        this._likePost$$.next(id);
    }

    private _likePost$(id: string): Observable<void> {
        return this._httpClient.post<void>(
            this._url + this._homeConstants.LikePostEndpoint(id),
            {}
        );
    }
}
