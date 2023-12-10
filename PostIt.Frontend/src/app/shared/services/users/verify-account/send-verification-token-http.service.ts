import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subject, catchError, filter, finalize, of, switchMap, takeUntil, tap } from 'rxjs';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';

@Injectable({
    providedIn: 'root',
})
export class SendVerificationTokenHttpService {
    private readonly _sendUrl: string =
        this._serverConstants.serverApi +
        this._homeConstants.sendVerificationTokenEndpoint;
    private _cancelRequest$$: Subject<void> = new Subject<void>();
    private _sendVerificationToken$$: Subject<void> = new Subject<void>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService
    ) {}

    public watchSendVerificationToken$(): Observable<void> {
        return this._sendVerificationToken$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((_) =>
                this._sendVerificationToken$().pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap(() => {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Token sent successfully',
                        });
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
                            case 401: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Invalid form data',
                                });
                                break;
                            }
                            default: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail:
                                        err.error.detail ??
                                        'Something went wrong',
                                });
                                break;
                            }
                        }
                    }),
                    switchMap(() => this.watchSendVerificationToken$())
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

    public sendVerificationToken(): void {
        this._sendVerificationToken$$.next();
    }

    private _sendVerificationToken$(): Observable<void> {
        return this._httpClient.post<void>(this._sendUrl, {});
    }
}
