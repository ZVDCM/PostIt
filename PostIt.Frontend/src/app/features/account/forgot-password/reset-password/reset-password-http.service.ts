import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ResetPasswordHttpService {
    public isLoading: boolean = false;
    constructor() {}
}
