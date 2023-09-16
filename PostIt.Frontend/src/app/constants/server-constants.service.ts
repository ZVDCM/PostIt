import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServerConstantsService {
    public readonly server = 'http://acme.com/api';
}
