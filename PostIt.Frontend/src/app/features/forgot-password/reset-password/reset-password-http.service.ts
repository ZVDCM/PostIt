import { Injectable } from '@angular/core';
import { IResetPassword } from './reset-password.model';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { ForgotPasswordConstantsService } from 'src/app/shared/constants/forgot-password-constants.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
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
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';

@Injectable({
    providedIn: 'root',
})
export class ResetPasswordHttpService {
    private readonly _url =
        this._serverConstants.serverApi +
        this._forgotPasswordConstants.resetPasswordEndpoint;
    private _resetPassword$$: Subject<IResetPassword> =
        new Subject<IResetPassword>();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _serverConstants: ServerConstantsService,
        private _loginConstants: LoginConstantsService,
        private _forgotPasswordConstants: ForgotPasswordConstantsService,
        private _httpClient: HttpClient,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService,
        private _router: Router
    ) {}

    public watchResetPassword$(): Observable<void> {
        return this._resetPassword$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((user: IResetPassword) =>
                this.resetPasswordUser(user).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap(() => {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Password reset successful',
                        });
                    }),
                    tap(() => {
                        this._router.navigate([
                            this._loginConstants.loginRoute,
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
                    switchMap(() => this.watchResetPassword$())
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

    public resetPassword(user: IResetPassword): void {
        this._resetPassword$$.next(user);
    }

    private resetPasswordUser(user: IResetPassword): Observable<void> {
        return this._httpClient.put<void>(this._url, user, {
            headers: {
                skip: 'true',
            },
        });
    }
}
