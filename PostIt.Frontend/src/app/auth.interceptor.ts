import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccessToken } from './core/state/access-token/access-token.selectors';
import { OneShotAuthHttpService } from './features/forgot-password/one-shot-auth-http.service';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private _store: Store,
        private _oneShot: OneShotAuthHttpService
    ) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        if (request.headers.has('skip')) {
            request = request.clone({
                headers: request.headers.delete('skip'),
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

        return next.handle(request);
    }
}
