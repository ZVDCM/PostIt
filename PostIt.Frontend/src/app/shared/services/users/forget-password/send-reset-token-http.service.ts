import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ForgotPasswordConstantsService } from 'src/app/shared/constants/forgot-password-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
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
import { ISendResetToken } from '../../../../core/models/send-reset-token.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { OneShotAuthService } from './one-shot-auth.service';

@Injectable({
    providedIn: 'root',
})
export class SendResetTokenHttpService {
    private readonly _url =
        this._serverConstants.serverApi +
        this._forgotPasswordConstants.sendResetTokenEndpoint;
    private _sendResetToken$$: Subject<ISendResetToken> =
        new Subject<ISendResetToken>();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _serverConstants: ServerConstantsService,
        private _forgotPasswordConstants: ForgotPasswordConstantsService,
        private _oneShot: OneShotAuthService,
        private _httpClient: HttpClient,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService,
        private _router: Router
    ) {}

    public watchSendResetToken$(): Observable<void> {
        return this._sendResetToken$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((user: ISendResetToken) =>
                this._sendResetToken$(user).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap(() => {
                        this._oneShot.email = user.email;
                    }),
                    tap(() => {
                        this._router.navigate([
                            this._forgotPasswordConstants.verifyResetTokenRoute,
                        ]);
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
                    switchMap(() => this.watchSendResetToken$())
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

    public sendResetToken(user: ISendResetToken): void {
        this._sendResetToken$$.next(user);
    }

    private _sendResetToken$(user: ISendResetToken): Observable<void> {
        return this._httpClient.post<void>(this._url, user);
    }
}
