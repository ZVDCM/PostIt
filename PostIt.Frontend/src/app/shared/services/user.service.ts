import { Injectable } from '@angular/core';
import { IUser } from '../types/userType';
import { ILoginPayload } from 'src/app/features/account/login/loginTypes';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _accessToken: string | null = null;
    private _user: IUser | null = null;

    public setCredentials(loginPayload: ILoginPayload): void {
        this._accessToken = loginPayload.accessToken;
        this._user = loginPayload.user;
    }

    get accessToken(): string | null {
        return this._accessToken;
    }

    get user(): IUser | null {
        return this._user;
    }
}
