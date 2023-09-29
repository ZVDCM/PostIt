import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { AccessTokenActions } from 'src/app/core/state/access-token/access-token.actions';
import { UserActions } from 'src/app/core/state/user/user.actions';
import { IAuthPayload } from 'src/app/features/login/auth/auth.model';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';

@Injectable({
    providedIn: 'root',
})
export class RefreshHttpService {
    private readonly _url = `${this._serverConstants.serverApi}/account/refresh`;

    constructor(
        private _http: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _store: Store
    ) {}

    public refresh$(): Observable<void> {
        return this._http
            .post<IAuthPayload>(this._url, {}, { withCredentials: true })
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
                })
            );
    }
}
