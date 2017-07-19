import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    kakaoLogin(): Promise<void> {
        let url = 'https://kauth.kakao.com/oauth/authorize?client_id=e377bae94f2edc3f3a3af327b3361ce5&redirect_uri=http://grassroots.kr/oauth&response_type=code&state=fdf49f903bd3d93a8d79354055335958104ec4d78f138060';
        return this.http.get(url)
            .toPromise()
            .then(response => {console.log(response.json()); return;})
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}