import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Decision } from '../_models';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class DecisionService {
  private decisionsUrl = 'api/v1.0/decisions/suwongreenparty';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthenticationService
  ) { }

  getDecisions(): Promise<Decision[]> {
    return this.http.get(this.decisionsUrl, this.auth.addJwt())
      .toPromise()
      .then(response => {
        let decisions = response.json() as Decision[];
        return decisions.map(decision => {
          decision.createdDate = new Date(decision.createdDate);
          decision.expiryDate = new Date(decision.expiryDate);
          return decision;
        })
      })
      .catch(this.handleError);
  }

  getDecision(id: number): Promise<Decision> {
    const url = `${this.decisionsUrl}/${id}`;
    return this.http.get(url, this.auth.addJwt())
      .toPromise()
      .then(response => {
        let decision = response.json() as Decision;
        decision.createdDate = new Date(decision.createdDate);
        decision.expiryDate = new Date(decision.expiryDate);
        return decision;
      })
      .catch(this.handleError);

  }

  update(decision: Decision): Promise<Decision> {
    const url = `${this.decisionsUrl}/${decision.id}`;
    return this.http
      .put(url, JSON.stringify(decision), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => decision)
      .catch(this.handleError);
  }

  create(decision: Decision): Promise<Decision> {
    return this.http
      .post(this.decisionsUrl, JSON.stringify(decision), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(response => {
        let decision = response.json() as Decision;
        decision.createdDate = new Date(decision.createdDate);
        decision.expiryDate = new Date(decision.expiryDate);
        return decision;
      })
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.decisionsUrl}/${id}`;
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