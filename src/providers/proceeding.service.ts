import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ProceedingListElement, ProceedingDetailElement, ProceedingEditorElement } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class ProceedingService {
  private proceedingsUrl = '/api/v1.0/groups';  // URL to web api
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

  getProceedings(group_id: number): Observable<ProceedingListElement[]> {
    const url = `${this.proceedingsUrl}/${group_id}/proceedings`;

    return this.http.get(url)
      .map(response => {
        let proceedings = response.json() as ProceedingListElement[];
        return proceedings.map(proceeding => {
          proceeding.created_datetime = this.convertTimestring(proceeding.created_datetime);
          proceeding.meeting_datetime = this.convertTimestring(proceeding.meeting_datetime);
          return proceeding;
        });
      })
      .take(1);
  }

  getProceeding(group_id: number, proceeding_id: number): Observable<ProceedingDetailElement> {
    const url = `${this.proceedingsUrl}/${group_id}/proceedings/${proceeding_id}`;

    return this.http.get(url)
      .map(response => {
        let proceeding = response.json() as ProceedingDetailElement;
        proceeding.created_datetime = this.convertTimestring(proceeding.created_datetime);
        proceeding.meeting_datetime = this.convertTimestring(proceeding.meeting_datetime);
        return proceeding;
      })
      .take(1);
  }

  update(group_id: number, proceeding_id: number): Observable<void> {
    const url = `${this.proceedingsUrl}/${group_id}/proceedings/${proceeding_id}`;
    return this.http
      .put(url, '', { headers: this.headers })
      .map(() => null)
      .take(1);
  }

  create(group_id: number, proceeding: ProceedingEditorElement): Observable<ProceedingListElement> {
    const url = `${this.proceedingsUrl}/${group_id}/proceedings`;
    return this.http
      .post(url, JSON.stringify(proceeding), { headers: this.headers })
      .map(response => {
        let res = response.json() as ProceedingListElement;
        return new ProceedingListElement(res.proceeding_id, 0, 0, res.document_state, new Date().toISOString(),
          proceeding.meeting_datetime, proceeding.title, proceeding.description, proceeding.attendee_ids.length,
          res.reviewers_count, 0, res.need_my_review, proceeding.child_decisions.length);
      })
      .take(1);
  }
}
