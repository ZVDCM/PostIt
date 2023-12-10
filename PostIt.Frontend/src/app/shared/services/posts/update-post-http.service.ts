import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProgressService } from 'src/app/shared/services/progress.service';
import {
    Observable,
    Subject,
    catchError,
    filter,
    finalize,
    of,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs';
import { IPostItem, IUpdatePost } from '../../../core/models/posts.model';

@Injectable({
    providedIn: 'root',
})
export class UpdatePostHttpService {
    public post: IPostItem = {} as IPostItem;
    private _url: string =
        this._serverConstants.serverApi +
        this._homeConstants.updatePostEndpoint;
    private _updatePost$$: Subject<IUpdatePost> = new Subject<IUpdatePost>();
    private _cancelRequest$$: Subject<void> = new Subject<void>();

    constructor(
        private _httpClient: HttpClient,
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService,
        private _progress: ProgressService,
        private _messageService: MessageService
    ) {}

    public watchUpdatePost$(): Observable<void> {
        return this._updatePost$$.asObservable().pipe(
            tap(() => {
                this._loading.startLoading();
                this._progress.isCancelled = true;
            }),
            switchMap((post: IUpdatePost) =>
                this._updatePost$(post).pipe(
                    takeUntil(this._cancelRequest$$),
                    tap(() => {
                        this._loading.endLoading();
                        this._progress.isCancelled = false;
                    }),
                    tap(() =>
                        this._messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Update was successful',
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
                                    detail: 'Invalid user credentials or verification',
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
                    switchMap(() => this.watchUpdatePost$())
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

    public updatePost(body: string): void {
        this._updatePost$$.next({ id: this.post.postId, body });
    }

    private _updatePost$(post: IUpdatePost): Observable<void> {
        return this._httpClient.put<void>(`${this._url}/${post.id}`, {
            body: post.body,
        });
    }
}
