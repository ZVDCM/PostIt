import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import {
    Observable,
    Subject,
    catchError,
    filter,
    finalize,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { AccessTokenActions } from 'src/app/core/state/access-token/access-token.actions';
import { UserActions } from 'src/app/core/state/user/user.actions';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';

@Injectable({
    providedIn: 'root',
})
export class LogoutHttpService {
    private readonly _url: string =
        this._serverConstants.serverApi + this._homeConstants.logoutEndpoint;
    private _logout$$: Subject<void> = new Subject<void>();

    public isLoading: boolean = false;
    public isCancelled: boolean = false;

    constructor(
        private _router: Router,
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loginConstants: LoginConstantsService,
        private _store: Store,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService
    ) {}

    public watchLogout$(): Observable<void> {
        return this._logout$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((_) =>
                this._logout$().pipe(
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap(() => {
                        this._store.dispatch(
                            AccessTokenActions.removeAccessToken()
                        );
                        this._store.dispatch(UserActions.removeUser());
                    }),
                    tap(() =>
                        this._router.navigate([this._loginConstants.loginRoute])
                    )
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
                            default: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: err.error?.detail ?? "Something went wrong",
                                });
                                break;
                            }
                        }
                    }),
                    switchMap(() => this.watchLogout$())
                )
            ),
            finalize(() => {
                if (this._progress.isCancelled) {
                    this._loading.endLoading();
                }
            })
        );
    }

    public logout(): void {
        this._logout$$.next();
    }

    public _logout$(): Observable<void> {
        return this._httpClient.post<void>(this._url, {});
    }
}
