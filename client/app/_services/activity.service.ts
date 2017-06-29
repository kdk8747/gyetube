import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Activity } from '../_models';

@Injectable()
export class ActivityService {
  private activitiesUrl = 'api/activities';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  getActivities(): Promise<Activity[]> {
    return this.http.get(this.activitiesUrl)
      .toPromise()
      .then(response => response.json() as Activity[])
      .catch(this.handleError);
  }

  getActivity(id: number): Promise<Activity> {
    const url = `${this.activitiesUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Activity)
      .catch(this.handleError);

  }

  update(hero: Activity): Promise<Activity> {
    const url = `${this.activitiesUrl}/${hero.id}`;
    return this.http
      .put(url, JSON.stringify(hero), { headers: this.headers })
      .toPromise()
      .then(() => hero)
      .catch(this.handleError);
  }

  create(name: string): Promise<Activity> {
    return this.http
      .post(this.activitiesUrl, JSON.stringify({ name: name }), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as Activity)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.activitiesUrl}/${id}`;
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