import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Policy } from '../_models';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class PolicyService {
  private policiesUrl = 'api/v1.0/suwongreenparty/policies';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthenticationService
  ) { }

  getPolicies(): Promise<Policy[]> {
    return this.http.get(this.policiesUrl, this.auth.addJwt())
      .toPromise()
      .then(response => {
        let policies = response.json() as Policy[];
        return policies.map(policy => {
          policy.createdDate = new Date(policy.createdDate);
          policy.expiryDate = new Date(policy.expiryDate);
          return policy;
        })
      })
      .catch(this.handleError);
  }

  getPolicy(id: number): Promise<Policy> {
    const url = `${this.policiesUrl}/${id}`;
    return this.http.get(url, this.auth.addJwt())
      .toPromise()
      .then(response => {
        let policy = response.json() as Policy;
        policy.createdDate = new Date(policy.createdDate);
        policy.expiryDate = new Date(policy.expiryDate);
        return policy;
      })
      .catch(this.handleError);

  }

  update(policy: Policy): Promise<Policy> {
    const url = `${this.policiesUrl}/${policy.id}`;
    return this.http
      .put(url, JSON.stringify(policy), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => policy)
      .catch(this.handleError);
  }

  create(policy: Policy): Promise<Policy> {
    return this.http
      .post(this.policiesUrl, JSON.stringify(policy), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(response => {
        let policy = response.json() as Policy;
        policy.createdDate = new Date(policy.createdDate);
        policy.expiryDate = new Date(policy.expiryDate);
        return policy;
      })
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.policiesUrl}/${id}`;
    return this.http.delete(url, this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    if (error.status == 401)
      window.location.href = 'login';
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}