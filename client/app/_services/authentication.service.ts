import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    kakaoLogin(): void {
        let url = 'https://kauth.kakao.com/oauth/authorize'
        +'?client_id=5761baf913c7452248956fbe892f0f19'
        +`&redirect_uri=http://${process.env.HOST_NAME}:${process.env.PORT}/oauth`
        +'&response_type=code'
        +'&state=fdf49f903bd3d93a8d79354055335958104ec4d78f138060';
        window.location.href = url;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}