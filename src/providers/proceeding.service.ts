import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Proceeding } from '../models';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/publishLast';


@Injectable()
export class ProceedingService {
  private proceedingsUrl = '/api/v1.0/proceedings';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  private proceedings = {};

  constructor(
    public http: AuthHttp
  ) { }

  print() {
    console.log('proceedings: ');
    for (let elem in this.proceedings)
      console.log(elem);
  }

  getProceedings(group_id: string): Observable<Proceeding[]> {
    const url = `${this.proceedingsUrl}/${group_id}`;

    return this.http.get(url)
      .map(response => response.json() as Proceeding[])
      .take(1);
  }

  cacheProceedings(group_id: string): void {
    const url = `${this.proceedingsUrl}/${group_id}`;

    this.http.get(url)
      .map(response => {
        let proceedings = response.json() as Proceeding[];
        proceedings.map(proceeding =>
          this.proceedings[group_id + proceeding.id] = new Observable<Proceeding>(obs => obs.next(proceeding))
        );
      }).publishLast().connect();
  }

  getProceeding(group_id: string, id: number): Observable<Proceeding> {
    const url = `${this.proceedingsUrl}/${group_id}/${id}`;

    if (!this.proceedings[group_id + id])
      this.proceedings[group_id + id] = this.http.get(url)
        .map(response => response.json() as Proceeding)
        .publishLast().refCount();
    return this.proceedings[group_id + id];
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
      .map(response => response.json() as Proceeding)
      .take(1);
  }

  delete(group_id: string, id: number): Observable<void> {
    const url = `${this.proceedingsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .map(() => null)
      .take(1);
  }
}
