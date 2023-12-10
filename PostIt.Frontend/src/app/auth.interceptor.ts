import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccessToken } from './core/state/access-token/access-token.selectors';
import { RefreshHttpService } from './shared/services/users/refresh-http.service';
import { OneShotAuthService } from './shared/services/users/forget-password/one-shot-auth.service';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private _store: Store,
        private _oneShot: OneShotAuthService,
        private _refreshHttp: RefreshHttpService
    ) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (request.headers.has('refresh')) {
            request = request.clone({
                headers: request.headers.delete('refresh'),
                withCredentials: true,
            });
            return next.handle(request);
        }

        if (request.headers.has('oneShot')) {
            request = request.clone({
                headers: request.headers.delete('oneShot'),
                setHeaders: {
                    Authorization: `Bearer ${this._oneShot.accessToken}`,
                },
                withCredentials: true,
            });
            return next.handle(request);
        }

        this._store.select(selectAccessToken).subscribe((accessToken) => {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            });
        });

        return next.handle(request).pipe(
            catchError((err) =>
                of(err).pipe(
                    filter((err) => err instanceof HttpErrorResponse),
                    filter((err) => err.status === 401),
                    tap((err) => alert(err)),
                    switchMap(() => {
                        return this._refreshHttp
                            .refresh$()
                            .pipe(switchMap(() => next.handle(request)));
                    })
                )
            )
        );
    }
}
