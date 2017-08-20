import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Proceeding } from '../models';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ProceedingService {
  private proceedingsUrl = 'api/v1.0/proceedings/suwongreenparty';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthenticationService
  ) { }

  getProceedings(): Promise<Proceeding[]> {
    return this.http.get(this.proceedingsUrl, this.auth.addJwt())
      .toPromise()
      .then(response => {
        let proceedings = response.json() as Proceeding[];
        return proceedings.map(proceeding => {
          proceeding.createdDate = new Date(proceeding.createdDate);
          proceeding.meetingDate = new Date(proceeding.meetingDate);
          return proceeding;
        })
      })
      .catch(this.handleError);
  }

  getProceeding(id: number): Promise<Proceeding> {
    const url = `${this.proceedingsUrl}/${id}`;
    return this.http.get(url, this.auth.addJwt())
      .toPromise()
      .then(response => {
        let proceeding = response.json() as Proceeding;
        proceeding.createdDate = new Date(proceeding.createdDate);
        proceeding.meetingDate = new Date(proceeding.meetingDate);
        return proceeding;
      })
      .catch(this.handleError);

  }

  update(proceeding: Proceeding): Promise<Proceeding> {
    const url = `${this.proceedingsUrl}/${proceeding.id}`;
    return this.http
      .put(url, JSON.stringify(proceeding), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => proceeding)
      .catch(this.handleError);
  }

  create(proceeding: Proceeding): Promise<Proceeding> {
    return this.http
      .post(this.proceedingsUrl, JSON.stringify(proceeding), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(response => {
        let proceeding = response.json() as Proceeding;
        proceeding.createdDate = new Date(proceeding.createdDate);
        proceeding.meetingDate = new Date(proceeding.meetingDate);
        return proceeding;
      })
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.proceedingsUrl}/${id}`;
    return this.http.delete(url, this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    if (error.status == 401)
      window.location.href = 'login';
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
