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
  private proceedingsUrl = '/api/v1.0/proceedings';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });


  constructor(
    public http: AuthHttp
  ) { }

  getProceedings(group_id: number): Observable<ProceedingListElement[]> {
    const url = `${this.proceedingsUrl}/${group_id}`;

    return this.http.get(url)
      .map(response => response.json() as ProceedingListElement[])
      .take(1);
  }

  getProceeding(group_id: number, proceeding_id: number): Observable<ProceedingDetailElement> {
    const url = `${this.proceedingsUrl}/${group_id}/${proceeding_id}`;

    return this.http.get(url)
      .map(response => response.json() as ProceedingDetailElement)
      .take(1);
  }

  update(group_id: number, proceeding_id: number): Observable<ProceedingDetailElement> {
    const url = `${this.proceedingsUrl}/${group_id}/${proceeding_id}`;
    return this.http
      .put(url, '', { headers: this.headers })
      .map(response => response.json() as ProceedingDetailElement)
      .take(1);
  }

  create(group_id: number, proceeding: ProceedingEditorElement): Observable<void> {
    const url = `${this.proceedingsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(proceeding), { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
