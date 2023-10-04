import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import {
    Observable,
    Subject,
    catchError,
    filter,
    finalize,
    map,
    of,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { IVerifyVerificationToken } from './verify-account.model';

@Injectable({
    providedIn: 'root',
})
export class VerifyAccountHttpService {
    private readonly _sendUrl: string =
        this._serverConstants.serverApi +
        this._homeConstants.sendVerificationTokenEndpoint;
    private readonly _verifyUrl: string =
        this._serverConstants.serverApi +
        this._homeConstants.verifyVerificationTokenEndpoint;
    private _cancelRequest$$: Subject<void> = new Subject<void>();
    private _sendVerificationToken$$: Subject<void> = new Subject<void>();
    private _verifyVerificationToken$$: Subject<IVerifyVerificationToken> =
        new Subject<IVerifyVerificationToken>();

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
                this.sendVerificationTokenUser().pipe(
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
                                    detail: err.error.detail,
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

    public watchVerifyVerificationToken$(): Observable<void> {
        return this._verifyVerificationToken$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((user: IVerifyVerificationToken) =>
                this.verifyVerificationTokenUser(user).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    map(() => {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Account verification successful',
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
                                    detail: 'Invalid user',
                                });
                                break;
                            }
                            default: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: err.error.detail,
                                });
                                break;
                            }
                        }
                    }),
                    switchMap(() => this.watchVerifyVerificationToken$())
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

    private sendVerificationTokenUser(): Observable<void> {
        return this._httpClient.post<void>(this._sendUrl, {});
    }

    public verifyVerificationToken(user: IVerifyVerificationToken): void {
        this._verifyVerificationToken$$.next(user);
    }

    private verifyVerificationTokenUser(
        user: IVerifyVerificationToken
    ): Observable<void> {
        return this._httpClient.put<void>(this._verifyUrl, user);
    }
}
