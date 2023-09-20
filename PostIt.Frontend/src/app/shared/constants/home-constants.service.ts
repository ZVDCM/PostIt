import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class HomeConstantsService {
    public readonly homeEndpoint = '/home';

    constructor() {}
}
