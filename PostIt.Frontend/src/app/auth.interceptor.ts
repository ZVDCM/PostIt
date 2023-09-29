import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable, } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccessToken } from './core/state/access-token/access-token.selectors';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private _store: Store
    ) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
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
