import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';

import { Decision } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DecisionService {
  private decisionsUrl = '/api/v1.0/decisions';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

  getDecisions(group_id: string): Observable<Decision[]> {
    const url = `${this.decisionsUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as Decision[])
      .take(1);
  }

  getDecision(group_id: string, id: number): Observable<Decision> {
    const url = `${this.decisionsUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .map(response => response.json() as Decision)
      .take(1);

  }

  update(group_id: string, decision: Decision): Observable<Decision> {
    const url = `${this.decisionsUrl}/${group_id}/${decision.id}`;
    return this.http
      .put(url, JSON.stringify(decision), { headers: this.headers })
      .map(() => decision)
      .take(1);
  }

  create(group_id: string, decision: Decision): Observable<Decision> {
    const url = `${this.decisionsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(decision), { headers: this.headers })
      .map(response => response.json() as Decision)
      .take(1);
  }

  delete(group_id: string, id: number): Observable<void> {
    const url = `${this.decisionsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
