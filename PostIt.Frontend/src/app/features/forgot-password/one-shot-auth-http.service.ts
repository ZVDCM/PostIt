import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class OneShotAuthHttpService {
    public email: string = '';
    public accessToken: string = '';
}
