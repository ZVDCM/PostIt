import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServerConstantsService {
    public readonly serverApi = 'https://postit.prod.dev/api';
}
