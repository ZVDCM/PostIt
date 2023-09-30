import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class VerifyResetTokenHttpService {
    public isLoading: boolean = false;
    constructor() {}
}
