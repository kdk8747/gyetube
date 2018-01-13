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
  private decisionsUrl = '/api/v1.0/groups';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });


  constructor(
    public http: AuthHttp
  ) { }

   //https://github.com/sidorares/node-mysql2/issues/262  // If this issue is closed, remove this workaround and add timezone=Z to JAWSDB_MARIA_URL
  convertTimestring(str: string) {
    if (str.length == 19)
      return str.replace(' ','T') + 'Z';
    else if (str.length == 10)
      return str + 'T00:00:00Z';
    else
      return new Date().toISOString();
  }

  getDecisions(group_id: number): Observable<DecisionListElement[]> {
    const url = `${this.decisionsUrl}/${group_id}/decisions`;
    return this.http.get(url)
      .map(response => {
        let decisions = response.json() as DecisionListElement[];
        return decisions.map(decision => {
          decision.expiry_datetime = this.convertTimestring(decision.expiry_datetime);
          decision.meeting_datetime = this.convertTimestring(decision.meeting_datetime);
          return decision;
        });
      })
      .take(1);
  }

  getDecision(group_id: number, decision_id: number): Observable<DecisionDetailElement> {
    const url = `${this.decisionsUrl}/${group_id}/decisions/${decision_id}`;

    return this.http.get(url)
      .map(response => {
        let decision = response.json() as DecisionDetailElement;
        decision.expiry_datetime = this.convertTimestring(decision.expiry_datetime);
        decision.meeting_datetime = this.convertTimestring(decision.meeting_datetime);
        return decision;
      })
      .take(1);
  }

  update(group_id: number, decision: DecisionDetailElement): Observable<DecisionDetailElement> {
    const url = `${this.decisionsUrl}/${group_id}/decisions/${decision.decision_id}`;
    return this.http
      .put(url, JSON.stringify(decision), { headers: this.headers })
      .map(() => decision)
      .take(1);
  }
}
