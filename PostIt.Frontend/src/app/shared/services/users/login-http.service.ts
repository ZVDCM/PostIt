import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin, IAuthPayload } from '../../../core/models/auth.model';
import {
    Observable,
    Subject,
    catchError,
    filter,
    finalize,
    map,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { Store } from '@ngrx/store';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { AccessTokenActions } from 'src/app/core/state/access-token/access-token.actions';
import { UserActions } from 'src/app/core/state/user/user.actions';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';

@Injectable({ providedIn: 'root' })
export class LoginHttpService {
    private readonly _url: string =
        this._serverConstants.serverApi + this._loginConstants.loginEndpoint;
    private _login$$: Subject<ILogin> = new Subject<ILogin>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _loginConstants: LoginConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService,
        private _router: Router,
        private _store: Store
    ) {}

    public watchLogin$(): Observable<void> {
        return this._login$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((user: ILogin) =>
                this._login$(user).pipe(
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    map((data: IAuthPayload) => {
                        this._store.dispatch(
                            AccessTokenActions.setAccessToken({
                                accessToken: data.accessToken,
                            })
                        );
                        this._store.dispatch(
                            UserActions.setUser({
                                user: data.user,
                            })
                        );
                    }),
                    tap(() => {
                        this._router.navigate([this._homeConstants.homeRoute]);
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
                    switchMap(() => this.watchLogin$())
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

    public login(user: ILogin): void {
        this._login$$.next(user);
    }

    private _login$(user: ILogin): Observable<IAuthPayload> {
        return this._httpClient.post<IAuthPayload>(this._url, user, {
            withCredentials: true,
        });
    }
}
