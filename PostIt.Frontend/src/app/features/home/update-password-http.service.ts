import { Injectable } from '@angular/core';
import { HomeConstantsService } from 'src/app/shared/constants/home-constants.service';
import { ServerConstantsService } from 'src/app/shared/constants/server-constants.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Injectable({
    providedIn: 'root',
})
export class UpdatePasswordHttpService {
    public isLoading: boolean = false;
    
    constructor(
        private _serverConstants: ServerConstantsService,
        private _homeConstants: HomeConstantsService,
        private _loading: LoadingService
    ) {}
}
