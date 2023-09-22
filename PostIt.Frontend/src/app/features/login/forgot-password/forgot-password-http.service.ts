import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ForgotPasswordHttpService {
    public isLoading: boolean = false;
    constructor() {}
}
