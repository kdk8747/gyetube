import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Proceeding } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';


@Injectable()
export class ProceedingService {
  private proceedingsUrl = '/api/v1.0/proceedings';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: AuthHttp
  ) { }

  getProceedings(group_id: string): Observable<Proceeding[]> {
    const url = `${this.proceedingsUrl}/${group_id}`;
    return this.http.get(url)
      .map(response => {
        let proceedings = response.json() as Proceeding[];
        return proceedings.map(proceeding => {
          proceeding.createdDate = new Date(proceeding.createdDate);
          proceeding.meetingDate = new Date(proceeding.meetingDate);
          return proceeding;
        })
      }).take(1);
  }

  getProceeding(group_id: string, id: number): Observable<Proceeding> {
    const url = `${this.proceedingsUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .map(response => {
        let proceeding = response.json() as Proceeding;
        proceeding.createdDate = new Date(proceeding.createdDate);
        proceeding.meetingDate = new Date(proceeding.meetingDate);
        return proceeding;
      }).take(1);

  }

  update(group_id: string, proceeding: Proceeding): Observable<Proceeding> {
    const url = `${this.proceedingsUrl}/${group_id}/${proceeding.id}`;
    return this.http
      .put(url, JSON.stringify(proceeding), { headers: this.headers })
      .map(() => proceeding)
      .take(1);
  }

  create(group_id: string, proceeding: Proceeding): Observable<Proceeding> {
    const url = `${this.proceedingsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(proceeding), { headers: this.headers })
      .map(response => {
        let proceeding = response.json() as Proceeding;
        proceeding.createdDate = new Date(proceeding.createdDate);
        proceeding.meetingDate = new Date(proceeding.meetingDate);
        return proceeding;
      }).take(1);
  }

  delete(group_id: string, id: number): Observable<void> {
    const url = `${this.proceedingsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
