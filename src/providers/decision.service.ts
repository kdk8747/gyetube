import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Decision } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class DecisionService {
  private decisionsUrl = '/api/v1.0/decisions';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  private decisions = {};

  constructor(
    public http: AuthHttp
  ) { }

  print() {
    console.log('decisions: ');
    for (let elem in this.decisions)
      console.log(elem);
  }

  getDecisions(group_id: number): Observable<Decision[]> {
    const url = `${this.decisionsUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => response.json() as Decision[])
      .take(1);
  }

  cacheDecisions(group_id: number): void {
    const url = `${this.decisionsUrl}/${group_id}`;
    this.http.get(url)
      .map(response => {
        let decisions = response.json() as Decision[];
        decisions.map(decision => {
          this.decisions[group_id + decision.id] = new Observable<Decision>(obs => obs.next(decision));
        });
      }).publishLast().connect(); // connect(): immediately fetch
  }

  getDecision(group_id: number, id: number): Observable<Decision> {
    const url = `${this.decisionsUrl}/${group_id}/${id}`;

    if (!this.decisions[group_id + id])
      this.decisions[group_id + id] = this.http.get(url)
        .map(response => response.json() as Decision)
        .publishLast().refCount();
    return this.decisions[group_id + id];
  }

  cacheDecision(group_id: number, id: number): Observable<Decision> {
    const url = `${this.decisionsUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .map(response => {
        let decision = response.json() as Decision;
        this.decisions[group_id + decision.id] = new Observable<Decision>(obs => obs.next(decision));
        return decision;
      });
  }

  update(group_id: number, decision: Decision): Observable<Decision> {
    const url = `${this.decisionsUrl}/${group_id}/${decision.id}`;
    return this.http
      .put(url, JSON.stringify(decision), { headers: this.headers })
      .map(() => decision)
      .take(1);
  }
}
