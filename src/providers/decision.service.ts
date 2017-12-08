import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { DecisionListElement, DecisionDetailElement } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class DecisionService {
  private decisionsUrl = '/api/v1.0/decisions';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });


  constructor(
    public http: AuthHttp
  ) { }

  getDecisions(group_id: number): Observable<DecisionListElement[]> {
    const url = `${this.decisionsUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as DecisionListElement[])
      .take(1);
  }

  getDecision(group_id: number, decision_id: number): Observable<DecisionDetailElement> {
    const url = `${this.decisionsUrl}/${group_id}/${decision_id}`;

    return this.http.get(url)
      .map(response => response.json() as DecisionDetailElement)
      .take(1);
  }

  update(group_id: number, decision: DecisionDetailElement): Observable<DecisionDetailElement> {
    const url = `${this.decisionsUrl}/${group_id}/${decision.decision_id}`;
    return this.http
      .put(url, JSON.stringify(decision), { headers: this.headers })
      .map(() => decision)
      .take(1);
  }
}
