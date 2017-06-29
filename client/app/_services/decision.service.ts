import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Decision } from '../_models';

@Injectable()
export class DecisionService {
  private decisionsUrl = 'api/decisions';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  getDecisions(): Promise<Decision[]> {
    return this.http.get(this.decisionsUrl)
      .toPromise()
      .then(response => response.json() as Decision[])
      .catch(this.handleError);
  }

  getDecision(id: number): Promise<Decision> {
    const url = `${this.decisionsUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Decision)
      .catch(this.handleError);

  }

  update(hero: Decision): Promise<Decision> {
    const url = `${this.decisionsUrl}/${hero.id}`;
    return this.http
      .put(url, JSON.stringify(hero), { headers: this.headers })
      .toPromise()
      .then(() => hero)
      .catch(this.handleError);
  }

  create(name: string): Promise<Decision> {
    return this.http
      .post(this.decisionsUrl, JSON.stringify({ name: name }), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Decision)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.decisionsUrl}/${id}`;
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