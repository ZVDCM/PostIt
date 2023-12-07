import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import { PostsHttpService } from './posts-http.service';
import { Observable, Subject, catchError, filter, finalize, of, switchMap, takeUntil, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UpdatePostHttpService {
    private _url: string =
        this._serverConstants.serverApi +
        this._homeConstants.deletePostEndpoint;
    private _deletePost$$: Subject<string> = new Subject<string>();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService,
        private _postsHttp: PostsHttpService
    ) {}

    public watchDeletePost$(): Observable<void> {
        return this._deletePost$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((id: string) =>
                this.deletePost$(id).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading(
                            this._postsHttp.getAllPosts({ page: 1 })!
                        );
                        this._progress.isCancelled = false;
                    }),
                    tap(() =>
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Creation was successful',
                        })
                    )
                )
            ),
            catchError((err) =>
                of(err).pipe(
                    filter((err) => err instanceof HttpErrorResponse),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap((err) => {
                        switch (err.status) {
                            case 400: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Invalid form data',
                                });
                                break;
                            }
                            case 401: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'User unauthorized',
                                });
                                break;
                            }
                            case 403: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Invalid user credentials',
                                });
                                break;
                            }
                            default: {
                                this._messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail:
                                        err.error?.detail ??
                                        'Something went wrong',
                                });
                                break;
                            }
                        }
                    }),
                    switchMap(() => this.watchDeletePost$())
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

    public cancelRequest(): void {
        if (this._loading.isLoading) {
            this._progress.isCancelled = null;
            this._loading.endLoading();
            this._cancelRequest$$.next();
        }
    }

    public updatePost(id: string): void {
        this._deletePost$$.next(id);
    }

    private deletePost$(id: string): Observable<void> {
        return this._httpClient.delete<void>(`${this._url}/${id}`);
    }
}
