import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Observable,
    Subject,
    catchError,
    concat,
    filter,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { AccountConstantsService } from 'src/app/shared/constants/account-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { IRegister } from './registerTypes';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class RegisterHttpService {
    private readonly _url: string =
        this._serverConstants.server + this._accountConstants.registerEndpoint;
    private _register$$: Subject<IRegister> = new Subject<IRegister>();

    public isLoading: boolean = false;

    constructor(
        private _router: Router,
        private _http: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _accountConstants: AccountConstantsService,
        private _messageService: MessageService,
        private _loading: LoadingService
    ) {}

    public watchRegister$(): Observable<void> {
        return this._register$$.asObservable().pipe(
            switchMap((user: IRegister) => this.registerUser(user)),
            tap((_) => {
                this.isLoading = false;
                this._router.navigate([this._accountConstants.loginEndpoint]);
                this._messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Registration was successful',
                });
            }),
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

    public register(user: IRegister): void {
        this._register$$.next(user);
    }

    private registerUser(user: IRegister): Observable<void> {
        return this._http.post<void>(this._url, user);
    }
}
