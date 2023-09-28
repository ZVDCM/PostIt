import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
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
            .post<void>(this._url, {}, { withCredentials: true })
            .pipe(
                tap((data) => {
                    console.log(data);
                })
            );
    }
}
