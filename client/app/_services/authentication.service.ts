import { Injectable } from '@angular/core';
import { Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';


@Injectable()
export class AuthenticationService {
    addJwt(options?: RequestOptionsArgs): RequestOptionsArgs {
        // ensure request options and headers are not null
        options = options || new RequestOptions();
        options.headers = options.headers || new Headers();

        // add authorization header with jwt token
        let currentUserToken = localStorage.getItem('currentUserToken');
        if (currentUserToken) {
            options.headers.append('Authorization', 'Bearer ' + currentUserToken);
        }

        return options;
    }
}