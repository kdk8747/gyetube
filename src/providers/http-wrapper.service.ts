import { Injectable, Inject } from '@angular/core';
import { Headers, Http, Response, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Storage } from '@ionic/storage';
import { EnvVariables } from '../app/environment-variables/environment-variables.token';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpWrapperService {

  constructor(
    private http: Http,
    private storage: Storage,
    @Inject(EnvVariables) public envVariables
  ) { }

  get(url: string, options?: RequestOptionsArgs): Promise<Response> {
    return this.addJwt(options)
      .then((options:RequestOptionsArgs) => this.http.get(this.envVariables.apiEndpoint + url, options).toPromise());
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
    return this.addJwt(options)
      .then((options:RequestOptionsArgs) => this.http.post(this.envVariables.apiEndpoint + url, body, options).toPromise());
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Promise<Response> {
    return this.addJwt(options)
      .then((options:RequestOptionsArgs) => this.http.put(this.envVariables.apiEndpoint + url, body, options).toPromise());
  }

  delete(url: string, options?: RequestOptionsArgs): Promise<Response> {
    return this.addJwt(options)
      .then((options:RequestOptionsArgs) => this.http.delete(this.envVariables.apiEndpoint + url, options).toPromise());
  }

  private addJwt(options?: RequestOptionsArgs): Promise<RequestOptionsArgs> {
    // ensure request options and headers are not null
    options = options || new RequestOptions();
    options.headers = options.headers || new Headers();

    // add authorization header with jwt token
    return this.storage.get('currentUserToken')
    .then((currentUserToken:string) => {
      if (currentUserToken)
        options.headers.set('Authorization', 'Bearer ' + currentUserToken);
      else
        options.headers.delete('Authorization');
      return options;
    }).catch(() => {
      return options;
    });
  }
}
