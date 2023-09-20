import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin, ILoginPayload } from './loginTypes';
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
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { Store } from '@ngrx/store';
import { AccessTokenApiActions } from 'src/app/core/state/access-token/access-token.actions';

@Injectable({ providedIn: 'root' })
export class LoginHttpService {
    private readonly _url: string =
        this._serverConstants.server + this._accountConstants.loginEndpoint;
    private _login$$: Subject<ILogin> = new Subject<ILogin>();

    public isLoading: boolean = false;
    public isCancelled: boolean = false;

    constructor(
        private _http: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _accountConstants: AccountConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _messageService: MessageService,
        private _router: Router,
        private _store: Store
    ) {}

    public watchLogin$(): Observable<void> {
        return this._login$$.asObservable().pipe(
            tap(() => {
                this.isLoading = true;
                this.isCancelled = true;
            }),
            switchMap((user: ILogin) =>
                this.loginUser(user).pipe(
                    tap((_) => {
                        this.isLoading = false;
                        this.isCancelled = false;
                    }),
                    tap((data: ILoginPayload) => {
                        this._store.dispatch(
                            AccessTokenApiActions.gotAccessToken({
                                accessToken: data.accessToken,
                            })
                        );
                    }),
                    tap((_) => {
                        this._router.navigate([
                            this._homeConstants.homeEndpoint,
                        ]);
                    })
                )
            ),
            catchError((err) =>
                of(err).pipe(
                    tap((_) => {
                        this.isLoading = this._loading.endLoading();
                        this.isCancelled = false;
                    }),
                    filter((err) => err instanceof HttpErrorResponse),
                    tap((err) => {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Unauthorized',
                        });
                    })
                )
            ),
            finalize(() => {
                if (this.isCancelled) {
                    this._loading.isCancelled = true;
                }
            })
        );
    }

    public login(user: ILogin): void {
        this._login$$.next(user);
    }

    private loginUser(user: ILogin): Observable<ILoginPayload> {
        return this._http.post<ILoginPayload>(this._url, user);
    }
}
