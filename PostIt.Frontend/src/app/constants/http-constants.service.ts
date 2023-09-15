import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpConstantsService {
    post = 'POST';
    get = 'GET';
    put = 'PUT';
    delete = 'DELETE';
}
