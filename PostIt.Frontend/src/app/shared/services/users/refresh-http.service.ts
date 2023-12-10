import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Observable, catchError, filter, map, of, tap } from 'rxjs';
import { AccessTokenActions } from 'src/app/core/state/access-token/access-token.actions';
import { UserActions } from 'src/app/core/state/user/user.actions';
import { IAuthPayload } from 'src/app/core/models/auth.model';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';

@Injectable({
    providedIn: 'root',
})
export class RefreshHttpService {
    private readonly _url = `${this._serverConstants.serverApi}/account/refresh`;

    constructor(
        private _http: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _store: Store,
        private _messageService: MessageService
    ) {}

    public refresh$(): Observable<void> {
        return this._http
            .post<IAuthPayload>(
                this._url,
                {},
                {
                    headers: {
                        refresh: 'true',
                    },
                }
            )
            .pipe(
                map((data: IAuthPayload) => {
                    this._store.dispatch(
                        AccessTokenActions.setAccessToken({
                            accessToken: data.accessToken,
                        })
                    );
                    this._store.dispatch(
                        UserActions.setUser({ user: data.user })
                    );
                }),
                catchError((err) =>
                    of(err).pipe(
                        filter((err) => err instanceof HttpErrorResponse),
                        tap((err) => {
                            switch (err.status) {
                                case 401: {
                                    this._messageService.add({
                                        severity: 'error',
                                        summary: 'Error',
                                        detail: 'Unauthorized',
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
                        })
                    )
                )
            );
    }
}
