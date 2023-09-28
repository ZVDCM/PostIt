import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, filter, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../../core/state/access-token/access-token.selectors';
import { RefreshHttpService } from 'src/app/shared/services/refresh-http.service';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private _refreshHttp: RefreshHttpService,
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
            });
        });

        return next.handle(request).pipe(
            catchError((err) =>
                of(err).pipe(
                    filter((err) => err instanceof HttpErrorResponse)
                    // switchMap((err) => {
                    //     switch (err.status) {
                    //         case 401: {
                    //             return this._refreshHttp.refresh$();
                    //         }
                    //         default: {
                    //             return of(err);
                    //         }
                    //     }
                    // })
                )
            )
        );
    }
}
