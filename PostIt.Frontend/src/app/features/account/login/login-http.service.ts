import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerConstantsService } from 'src/app/constants/server-constants.service';
import { ILogin, ILoginPayload } from './loginTypes';
import { LoginConstantsService } from 'src/app/constants/login-constants.service';
import { Observable, Subject, catchError, map, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginHttpService {
    private readonly _url: string =
        this._serverConstants.server + this._loginConstants.loginEndpoint;
    private _login$$: Subject<ILogin> = new Subject<ILogin>();

    public isLoading: boolean = false;

    public userData: ILoginPayload = {} as ILoginPayload;

    constructor(
        private _http: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _loginConstants: LoginConstantsService
    ) {}

    public watchLogin$(): Observable<void> {
        return this._login$$.asObservable().pipe(
            tap((_) => (this.isLoading = true)),
            switchMap((user: ILogin) =>
                this.loginUser(user).pipe(
                    map((data: ILoginPayload) => {
                        this.userData = data;
                        console.log(data);
                        return undefined;
                    })
                )
            ),
            catchError((err) => {
                if (err instanceof HttpErrorResponse)
                    console.log('unauthorized');
                return new Observable<void>();
            }),
            tap((_) => (this.isLoading = false))
        );
    }

    public login(user: ILogin): void {
        this._login$$.next(user);
    }

    private loginUser(user: ILogin): Observable<ILoginPayload> {
        return this._http.post<ILoginPayload>(this._url, user);
    }
}
