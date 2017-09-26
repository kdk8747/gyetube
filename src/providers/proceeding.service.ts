import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Proceeding } from '../models';
import { HttpWrapperService } from './http-wrapper.service';

@Injectable()
export class ProceedingService {
  private proceedingsUrl = '/api/v1.0/proceedings';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    public http: HttpWrapperService
  ) { }

  getProceedings(group_id: string): Promise<Proceeding[]> {
    const url = `${this.proceedingsUrl}/${group_id}`;
    return this.http.get(url)
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

  getProceeding(group_id: string, id: number): Promise<Proceeding> {
    const url = `${this.proceedingsUrl}/${group_id}/${id}`;
    return this.http.get(url)
      .then(response => {
        let proceeding = response.json() as Proceeding;
        proceeding.createdDate = new Date(proceeding.createdDate);
        proceeding.meetingDate = new Date(proceeding.meetingDate);
        return proceeding;
      })
      .catch(this.handleError);

  }

  update(group_id: string, proceeding: Proceeding): Promise<Proceeding> {
    const url = `${this.proceedingsUrl}/${group_id}/${proceeding.id}`;
    return this.http
      .put(url, JSON.stringify(proceeding), { headers: this.headers })
      .then(() => proceeding)
      .catch(this.handleError);
  }

  create(group_id: string, proceeding: Proceeding): Promise<Proceeding> {
    const url = `${this.proceedingsUrl}/${group_id}`;
    return this.http
      .post(url, JSON.stringify(proceeding), { headers: this.headers })
      .then(response => {
        let proceeding = response.json() as Proceeding;
        proceeding.createdDate = new Date(proceeding.createdDate);
        proceeding.meetingDate = new Date(proceeding.meetingDate);
        return proceeding;
      })
      .catch(this.handleError);
  }

  delete(group_id: string, id: number): Promise<void> {
    const url = `${this.proceedingsUrl}/${group_id}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
