import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    Observable,
    Subject,
    catchError,
    filter,
    finalize,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { IRegister } from './register.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginConstantsService } from 'src/app/shared/constants/login-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';

@Injectable({
    providedIn: 'root',
})
export class RegisterHttpService {
    private readonly _url: string =
        this._serverConstants.serverApi + this._loginConstants.registerEndpoint;
    private _register$$: Subject<IRegister> = new Subject<IRegister>();

    constructor(
        private _router: Router,
        private _http: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _loginConstants: LoginConstantsService,
        private _messageService: MessageService,
        private _loading: LoadingService,
        private _progress: ProgressService
    ) {}

    public watchRegister$(): Observable<void> {
        return this._register$$.asObservable().pipe(
            tap((_) => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((user: IRegister) =>
                this.registerUser(user).pipe(
                    tap((_) => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap((_) => {
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Registration was successful',
                        });
                    }),
                    tap((_) => {
                        this._router.navigate([
                            this._loginConstants.loginRoute,
                        ]);
                    })
                )
            ),
            catchError((err) =>
                of(err).pipe(
                    filter((err) => err instanceof HttpErrorResponse),
                    tap((_) => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap((err) => {
                        switch (err.status) {
                            case 400: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Registration Error',
                                    detail: 'Invalid form data',
                                });
                                break;
                            }
                            case 409: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Registration Error',
                                    detail: 'Email already in use',
                                });
                                break;
                            }
                            default: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Server Error',
                                    detail: 'Something went wrong',
                                });
                            }
                        }
                    }),
                    switchMap(() => this.watchRegister$())
                )
            ),
            finalize(() => {
                if (this._progress.isCancelled) {
                    this._progress.isCancelled = null;
                    this._loading.endLoading();
                }
            })
        );
    }

    public register(user: IRegister): void {
        this._register$$.next(user);
    }

    private registerUser(user: IRegister): Observable<void> {
        return this._http.post<void>(this._url, user);
    }
}
