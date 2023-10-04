import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ForgotPasswordConstantsService } from 'src/app/shared/constants/forgot-password-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { OneShotAuthHttpService } from '../one-shot-auth-http.service';
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
import { IVerifyResetToken } from './verify-reset-token.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { IAuthPayload } from '../../login/auth.model';

@Injectable({
    providedIn: 'root',
})
export class VerifyResetTokenHttpService {
    private readonly _url =
        this._serverConstants.serverApi +
        this._forgotPasswordConstants.verifyResetTokenEndpoint;
    private _verifyResetToken$$: Subject<IVerifyResetToken> =
        new Subject<IVerifyResetToken>();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _forgotPasswordConstants: ForgotPasswordConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService,
        private _oneShot: OneShotAuthHttpService,
        private _router: Router
    ) {}

    public watchVerifyResetToken$(): Observable<void> {
        return this._verifyResetToken$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((user: IVerifyResetToken) => {
                return this.verifyResetTokenUser(user).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    map((data: IAuthPayload) => {
                        this._oneShot.accessToken = data.accessToken;
                        this._oneShot.user = data.user;
                    }),
                    tap(() => {
                        this._router.navigate([
                            this._forgotPasswordConstants.resetPasswordRoute,
                        ]);
                    })
                );
            }),
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
                                    detail: 'Invalid Reset Token',
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
                    switchMap(() => this.watchVerifyResetToken$())
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

    public verifyResetToken(user: IVerifyResetToken): void {
        this._verifyResetToken$$.next({ ...user, email: this._oneShot.email });
    }

    public verifyResetTokenUser(
        user: IVerifyResetToken
    ): Observable<IAuthPayload> {
        return this._httpClient.post<IAuthPayload>(this._url, user);
    }
}
