import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Decision } from '../models';
import { HttpWrapperService } from './http-wrapper.service';

@Injectable()
export class DecisionService {
  private decisionsUrl = '/api/v1.0/decisions';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: HttpWrapperService
  ) { }

  getDecisions(group_id: string): Promise<Decision[]> {
    const url = `${this.decisionsUrl}/${group_id}`;
    return this.http.get(url)
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

  getDecision(group_id: string, id: number): Promise<Decision> {
    const url = `${this.decisionsUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .then(response => {
        let decision = response.json() as Decision;
        decision.createdDate = new Date(decision.createdDate);
        decision.expiryDate = new Date(decision.expiryDate);
        return decision;
      })
      .catch(this.handleError);

  }

  update(group_id: string, decision: Decision): Promise<Decision> {
    const url = `${this.decisionsUrl}/${group_id}/${decision.id}`;
    return this.http
      .put(url, JSON.stringify(decision), { headers: this.headers })
      .then(() => decision)
      .catch(this.handleError);
  }

  create(group_id: string, decision: Decision): Promise<Decision> {
    const url = `${this.decisionsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(decision), { headers: this.headers })
      .then(response => {
        let decision = response.json() as Decision;
        decision.createdDate = new Date(decision.createdDate);
        decision.expiryDate = new Date(decision.expiryDate);
        return decision;
      })
      .catch(this.handleError);
  }

  delete(group_id: string, id: number): Promise<void> {
    const url = `${this.decisionsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
