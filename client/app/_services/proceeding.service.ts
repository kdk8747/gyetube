import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Proceeding } from '../_models';

@Injectable()
export class ProceedingService {
  private proceedingsUrl = 'api/proceedings';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  getProceedings(): Promise<Proceeding[]> {
    return this.http.get(this.proceedingsUrl)
      .toPromise()
      .then(response => response.json() as Proceeding[])
      .catch(this.handleError);
  }

  getProceeding(id: number): Promise<Proceeding> {
    const url = `${this.proceedingsUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Proceeding)
      .catch(this.handleError);

  }

  update(proceeding: Proceeding): Promise<Proceeding> {
    const url = `${this.proceedingsUrl}/${proceeding.id}`;
    return this.http
      .put(url, JSON.stringify(proceeding), { headers: this.headers })
      .toPromise()
      .then(() => proceeding)
      .catch(this.handleError);
  }

  create(proceeding: Proceeding): Promise<Proceeding> {
    return this.http
      .post(this.proceedingsUrl, JSON.stringify(proceeding), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Proceeding)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.proceedingsUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}