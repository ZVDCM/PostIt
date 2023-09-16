import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerConstantsService } from 'src/app/constants/server-constants.service';
import { ILogin, ILoginPayload } from './loginTypes';
import { LoginConstantsService } from 'src/app/constants/login-constants.service';
import { Observable, Subject, catchError, map, switchMap, tap } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Injectable({ providedIn: 'root' })
export class LoginHttpService {
    private readonly _url: string =
        this._serverConstants.server + this._loginConstants.loginEndpoint;
    private _login$$: Subject<ILogin> = new Subject<ILogin>();

    public isLoading: boolean = false;

    constructor(
        private _http: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _loginConstants: LoginConstantsService,
        private _user: UserService,
        private _loading: LoadingService
    ) {}

    public watchLogin$(): Observable<void> {
        return this._login$$.asObservable().pipe(
            switchMap((user: ILogin) =>
                this.loginUser(user).pipe(
                    map((data: ILoginPayload) => {
                        this._user.setCredentials(data);
                        console.log(data);
                        return void 0;
                    })
                )
            ),
            catchError((err) => {
                if (err instanceof HttpErrorResponse)
                    console.log('unauthorized');
                return new Observable<void>();
            }),
            tap((_) => (this.isLoading = this._loading.endLoading()))
        );
    }

    public login(user: ILogin): void {
        this._login$$.next(user);
    }

    private loginUser(user: ILogin): Observable<ILoginPayload> {
        return this._http.post<ILoginPayload>(this._url, user);
    }
}
