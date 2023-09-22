import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UpdateProfileHttpService {
    public isLoading: boolean = false;
    constructor() {}
}
