import { Injectable } from '@angular/core';
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
import { IVerifyVerificationToken } from '../../../../core/models/verify-verification-token.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { UserActions } from 'src/app/core/state/user/user.actions';
import { selectUser } from 'src/app/core/state/user/user.selectors';

@Injectable({
    providedIn: 'root',
})
export class VerifyVerificationTokenHttpService {
    private readonly _verifyUrl: string =
        this._serverConstants.serverApi +
        this._homeConstants.verifyVerificationTokenEndpoint;
    private _cancelRequest$$: Subject<void> = new Subject<void>();
    private _verifyVerificationToken$$: Subject<IVerifyVerificationToken> =
        new Subject<IVerifyVerificationToken>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService,
        private _store: Store,
    ) {}

    public watchVerifyVerificationToken$(): Observable<void> {
        return this._verifyVerificationToken$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((user: IVerifyVerificationToken) =>
                this._verifyVerificationToken$(user).pipe(
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
                        this._store.dispatch(UserActions.verifyUser());
                        this._store.select(selectUser).subscribe(user => console.log(user))
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
                                    detail: 'Invalid user credentials or verification',
                                });
                                break;
                            }
                            case 404: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Token not found',
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

    public verifyVerificationToken(user: IVerifyVerificationToken): void {
        this._verifyVerificationToken$$.next(user);
    }

    private _verifyVerificationToken$(
        user: IVerifyVerificationToken
    ): Observable<void> {
        return this._httpClient.put<void>(this._verifyUrl, user);
    }
}
