import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Activity } from '../_models';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ActivityService {
  private activitiesUrl = 'api/v1.0/suwongreenparty/activities';  // URL to web api
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(
    private http: Http,
    private auth: AuthenticationService
  ) { }

  getActivities(): Promise<Activity[]> {
    return this.http.get(this.activitiesUrl, this.auth.addJwt())
      .toPromise()
      .then(response => {
        let activities = response.json() as Activity[];
        return activities.map(activity => {
          activity.modifiedDate = new Date(activity.modifiedDate);
          activity.activityDate = new Date(activity.activityDate);
          return activity;
        })
      })
      .catch(this.handleError);
  }

  getActivity(id: number): Promise<Activity> {
    const url = `${this.activitiesUrl}/${id}`;
    return this.http.get(url, this.auth.addJwt())
      .toPromise()
      .then(response => {
        let activity = response.json() as Activity;
        activity.modifiedDate = new Date(activity.modifiedDate);
        activity.activityDate = new Date(activity.activityDate);
        return activity;
      })
      .catch(this.handleError);

  }

  update(activity: Activity): Promise<Activity> {
    const url = `${this.activitiesUrl}/${activity.id}`;
    return this.http
      .put(url, JSON.stringify(activity), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(() => activity)
      .catch(this.handleError);
  }

  create(activity: Activity): Promise<Activity> {
    return this.http
      .post(this.activitiesUrl, JSON.stringify(activity), this.auth.addJwt({ headers: this.headers }))
      .toPromise()
      .then(response => {
        let activity = response.json() as Activity;
        activity.modifiedDate = new Date(activity.modifiedDate);
        activity.activityDate = new Date(activity.activityDate);
        return activity;
      })
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.activitiesUrl}/${id}`;
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