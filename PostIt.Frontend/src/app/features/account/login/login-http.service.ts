import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin, ILoginPayload } from './loginTypes';
import {
    Observable,
    Subject,
    catchError,
    concat,
    filter,
    map,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class LoginHttpService {
    private readonly _url: string =
        this._serverConstants.server + this._accountConstants.loginEndpoint;
    private _login$$: Subject<ILogin> = new Subject<ILogin>();

    public isLoading: boolean = false;

    constructor(
        private _http: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _accountConstants: AccountConstantsService,
        private _user: UserService,
        private _loading: LoadingService,
        private _messageService: MessageService
    ) {}

    public watchLogin$(): Observable<void> {
        return this._login$$.asObservable().pipe(
            switchMap((user: ILogin) =>
                this.loginUser(user).pipe(
                    tap((data: ILoginPayload) => {
                        this.isLoading = false;
                        this._user.setCredentials(data);
                        console.log(data);
                    })
                )
            ),
            catchError((err) =>
                of(err).pipe(
                    filter((err) => err instanceof HttpErrorResponse),
                    tap((_) => (this.isLoading = this._loading.endLoading())),
                    tap((err) => {
                        this._messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error in registration',
                        });
                    })
                )
            )
        );
    }

    public login(user: ILogin): void {
        this._login$$.next(user);
    }

    private loginUser(user: ILogin): Observable<ILoginPayload> {
        return this._http.post<ILoginPayload>(this._url, user);
    }
}
